package com.project.VaultNet.dto.Admin;

import com.project.VaultNet.model.Address;
import com.project.VaultNet.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDetailResponse {
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
    private String verificationLink;
    private Date createdAt;
}

