# Firestore Security Specification - North Fitness Camp

## Data Invariants
1. **User Profiles**: A user can only manage their own profile. Roles (admin) are immutable by the user.
2. **Subscribers**: Newsletter signups are public-write (create only) but admin-read. The document ID must match the email.
3. **Enrollments**: Enrollment forms are public-write (create only) but admin-read.

## The "Dirty Dozen" Payloads (Attack Vectors)

### Identity Attacks
1. **Spoof User ID**: Authenticated User A tries to create/update `/users/UserB`.
2. **Elevate Role**: User A tries to set `role: 'admin'` on their own profile.

### Integrity Attacks
3. **Junk Document ID**: Creating an enrollment with a 1MB string as the document ID.
4. **Shadow Fields**: Adding `isPromoted: true` to an enrollment payload.
5. **Type Poisoning**: Sending `mobileNumber: 1234567890` (number) instead of a string.

### Resource Attacks
6. **Denial of Wallet (Collection Scraping)**: Trying to list all `subscribers` without being an admin.
7. **Large Payload**: Sending a notes field with 2MB of text.
8. **Timestamp Spoofing**: Sending a client-side `submittedAt` from 1999.

### Relational Attacks
9. **Duplicate Subscriber**: Trying to overwrite an existing subscriber email.

## Permissions Matrix

| Collection | Create | Read (Get) | List | Update | Delete |
|------------|--------|------------|------|--------|--------|
| /users     | Owner  | Owner/Admin| Admin| Owner* | Admin  |
| /subscribers| Public| Admin      | Admin| Admin  | Admin  |
| /enrollments| Public| Admin      | Admin| Admin  | Admin  |

*\* Specific fields only*
