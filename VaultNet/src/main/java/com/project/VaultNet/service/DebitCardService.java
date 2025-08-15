package com.project.VaultNet.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.project.VaultNet.customexceptions.ResourceNotFoundException;
import com.project.VaultNet.model.DebitCard;
import com.project.VaultNet.model.Users;
import com.project.VaultNet.repository.DebitCardRepository;
import com.project.VaultNet.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class DebitCardService {

    private final JavaMailSender mailSender;
    private final DebitCardRepository debitCardRepository;

    @Autowired
    public DebitCardService(JavaMailSender mailSender, DebitCardRepository debitCardRepository) {
        this.mailSender = mailSender;
        this.debitCardRepository = debitCardRepository;
    }

    @Autowired
    UserRepository userRepository;

    public void sendVirtualCardEmail(String email, String fullName, String phone) {
        try {
            // Generate password for PDF encryption
            String firstName = fullName.split(" ")[0].toUpperCase();
            String password = firstName.substring(0, Math.min(4, firstName.length())) + phone.substring(phone.length() - 4);

            // Generate card details
            String cardNumber = generateCardNumber();
            String accountNumber = generateCardNumber();
            String cvv = generateCVV();
            String expiry = generateExpiryDate();

            Users user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

            // Save card to DB
            DebitCard card = new DebitCard();
            card.setCardHolderName(fullName);
            card.setCardNumber(cardNumber);
            card.setAccountNumber(accountNumber);
            card.setCvv(cvv);
            card.setExpiryDate(expiry);
            card.setEmail(email);
            card.setPhone(phone);
            card.setIssuedAt(LocalDateTime.now());
            card.setUser(user);
            debitCardRepository.save(card);

            // Create encrypted PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            generateCardPdf(fullName, cardNumber, expiry, cvv, baos, password);

            // Send email with PDF attachment
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("💳 Your Encrypted Virtual Debit Card is Ready to Use!");
            helper.setText(
                    "<!DOCTYPE html>" +
                            "<html>" +
                            "<head>" +
                            "<meta charset='UTF-8'>" +
                            "<style>" +
                            "  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                            "  .container { background: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }" +
                            "  .header { background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 20px; }" +
                            "  .content { padding: 20px; color: #333333; line-height: 1.6; }" +
                            "  .highlight { background-color: #f0f8ff; padding: 10px; border-left: 4px solid #007bff; font-weight: bold; }" +
                            "  .footer { text-align: center; font-size: 12px; color: #777; padding: 15px; background: #fafafa; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "  <div class='container'>" +
                            "    <div class='header'>💳 Your Virtual Debit Card is Ready!</div>" +
                            "    <div class='content'>" +
                            "      <p>Hello <strong>" + fullName + "</strong>,</p>" +
                            "      <p>We’re excited to inform you that your <strong>secure, encrypted Virtual Debit Card</strong> is now ready for use! 🎉</p>" +
                            "      <div class='highlight'>" +
                            "        🔐 Password: First 4 letters of your first name (UPPERCASE) + last 4 digits of your phone number." +
                            "      </div>" +
                            "      <p>📎 Your card is attached to this email.</p>" +
                            "      <p>💡 <em>Tip:</em> Keep your password safe and never share it with anyone.</p>" +
                            "      <p>Enjoy safe and secure spending!</p>" +
                            "      <p>— Your Bank Security Team</p>" +
                            "    </div>" +
                            "    <div class='footer'>© 2025 Your Bank. All rights reserved.</div>" +
                            "  </div>" +
                            "</body>" +
                            "</html>",
                    true // <-- this is important to send HTML email
            );

            ByteArrayResource pdfAttachment = new ByteArrayResource(baos.toByteArray());
            helper.addAttachment("VirtualDebitCard.pdf", pdfAttachment);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace(); // You should log this properly in production
        }
    }

    private void generateCardPdf(String fullName, String cardNumber, String expiry, String cvv,
                                 ByteArrayOutputStream baos, String password) throws Exception {

        Document document = new Document(new Rectangle(300, 180));
        PdfWriter writer = PdfWriter.getInstance(document, baos);

        writer.setEncryption(password.getBytes(), password.getBytes(),
                PdfWriter.ALLOW_PRINTING, PdfWriter.ENCRYPTION_AES_128);

        document.open();

        PdfContentByte canvas = writer.getDirectContent();
        Color cardColor = new Color(30, 45, 100); // dark navy blue
        canvas.setColorFill(cardColor);
        canvas.rectangle(0, 0, 300, 180);
        canvas.fill();

        // Add content over the blue background
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
        table.getDefaultCell().setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.getDefaultCell().setPaddingTop(10f);

        Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        Font fontSmall = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.WHITE);

        table.addCell(new Phrase("VAULTNET VIRTUAL DEBIT CARD", fontBold));
        table.addCell(new Phrase("Card Number: " + cardNumber, fontBold));
        table.addCell(new Phrase("Valid Thru: " + expiry, fontSmall));
        table.addCell(new Phrase("CVV: " + cvv, fontSmall));
        table.addCell(new Phrase("Cardholder: " + fullName, fontSmall));

        document.add(table);
        document.close();
    }

    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder cardNum = new StringBuilder("4123 ");
        for (int i = 0; i < 3; i++) {
            cardNum.append(String.format("%04d ", random.nextInt(10000)));
        }
        return cardNum.toString().trim();
    }

    private String generateCVV() {
        return String.format("%03d", new Random().nextInt(1000));
    }

    private String generateExpiryDate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiry = now.plusYears(3);
        return expiry.format(DateTimeFormatter.ofPattern("MM/yy"));
    }

    public DebitCard unblockCard(String cardNumber) {
        DebitCard card = debitCardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.isCardBlocked()) {
            throw new RuntimeException("Card is not blocked.");
        }

        card.setCardBlocked(false);
        card.setOtp(null);        // Optional: clear OTP state
        card.setOtpExpiresAt(null);   // Optional: clear OTP expiration
        return debitCardRepository.save(card);
    }

    public ResponseEntity<String> sendAtmCard(Principal principal) {
        try {
            Users user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid session"));

            DebitCard debitCard = debitCardRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Debit card not found for user"));

            String firstName = debitCard.getCardHolderName().split(" ")[0].toUpperCase();
            String password = firstName.substring(0, Math.min(4, firstName.length())) +
                    debitCard.getPhone().substring(debitCard.getPhone().length() - 4);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            generateCardPdf(debitCard.getCardHolderName(), debitCard.getCardNumber(),
                    debitCard.getExpiryDate(), debitCard.getCvv(), baos, password);

            // Prepare email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(debitCard.getEmail());
            helper.setSubject("💳 Your Encrypted Virtual Debit Card is Ready to Use!");
            helper.setText(
                    "<!DOCTYPE html>" +
                            "<html>" +
                            "<head>" +
                            "<meta charset='UTF-8'>" +
                            "<style>" +
                            "  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                            "  .container { background: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }" +
                            "  .header { background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 20px; }" +
                            "  .content { padding: 20px; color: #333333; line-height: 1.6; }" +
                            "  .highlight { background-color: #f0f8ff; padding: 10px; border-left: 4px solid #007bff; font-weight: bold; }" +
                            "  .footer { text-align: center; font-size: 12px; color: #777; padding: 15px; background: #fafafa; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "  <div class='container'>" +
                            "    <div class='header'>💳 Your Virtual Debit Card is Ready!</div>" +
                            "    <div class='content'>" +
                            "      <p>Hello <strong>" + firstName + "</strong>,</p>" +
                            "      <p>We’re excited to inform you that your <strong>secure, encrypted Virtual Debit Card</strong> is now ready for use! 🎉</p>" +
                            "      <div class='highlight'>" +
                            "        🔐 Password: First 4 letters of your first name (UPPERCASE) + last 4 digits of your phone number." +
                            "      </div>" +
                            "      <p>📎 Your card is attached to this email.</p>" +
                            "      <p>💡 <em>Tip:</em> Keep your password safe and never share it with anyone.</p>" +
                            "      <p>Enjoy safe and secure spending!</p>" +
                            "      <p>— Your Bank Security Team</p>" +
                            "    </div>" +
                            "    <div class='footer'>© 2025 Your Bank. All rights reserved.</div>" +
                            "  </div>" +
                            "</body>" +
                            "</html>",
                    true // <-- this is important to send HTML email
            );
            ByteArrayResource pdfAttachment = new ByteArrayResource(baos.toByteArray());
            helper.addAttachment("VirtualDebitCard.pdf", pdfAttachment);

            mailSender.send(message);

            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Virtual debit card sent successfully to your email.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error sending virtual debit card: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while sending your virtual debit card.");
        }
    }
}
