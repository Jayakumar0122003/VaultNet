package com.project.VaultNet.dto.AccountCreation;

import com.project.VaultNet.model.Address;
import com.project.VaultNet.model.Role;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    private Long id;
    private String email;
    private String username;
    private Role role;

    private String firstName;
    private String lastName;
    private String phone;
    private Address address;
    private LocalDate dob;
    private boolean emailVerified;
    private boolean accountCreated;
    private Date createdAt;
}
