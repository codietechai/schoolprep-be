/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     description: Allows a user to log in by providing email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: 'supersecretpassword'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token to access protected routes.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: Bad request - Missing or invalid parameters
 *       401:
 *         description: Unauthorized - Invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: User signup
 *     description: Allows a user to sign up by providing their details, such as selected chart, algorithm, email, password, and agreement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address for the user.
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: The password the user wants to set.
 *                 example: 'supersecretpassword'
 *               isAgreed:
 *                 type: integer
 *                 description: A flag indicating if the user has agreed to terms (1 = agreed, 0 = not agreed).
 *                 example: 1
 *               captcha:
 *                 type: string
 *                 description: The captcha response that the user provides to verify they are human.
 *                 example: 'abcd1234'
 *     responses:
 *       201:
 *         description: User created successfully. Returns a confirmation message and user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating user creation success.
 *                   example: 'User registered successfully.'
 *       400:
 *         description: Bad request - Missing or invalid parameters (e.g., missing required fields or invalid captcha).
 *       422:
 *         description: Unprocessable entity - Validation errors, such as invalid email format or missing fields.
 *       500:
 *         description: Internal server error - Server issues, possibly during user creation.
 */

/**
 * @swagger
 * /user/edit-profile:
 *   post:
 *     summary: Edit user profile
 *     description: Allows an authenticated user to update their profile information such as email, full name, contact number, and phone code.
 *     security:
 *       - BearerAuth: []  # Authentication required via Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: 'john.doe@example.com'
 *               full_name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: 'John Doe'
 *               contact_number:
 *                 type: string
 *                 description: The user's contact number.
 *                 example: '+1234567890'
 *               phone_code:
 *                 type: integer
 *                 description: The country phone code for the contact number.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Profile updated successfully. Returns updated user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: 'Profile updated successfully.'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user's ID.
 *                       example: 123
 *                     email:
 *                       type: string
 *                       description: The user's updated email address.
 *                       example: 'john.doe@example.com'
 *                     full_name:
 *                       type: string
 *                       description: The user's updated full name.
 *                       example: 'John Doe'
 *                     contact_number:
 *                       type: string
 *                       description: The user's updated contact number.
 *                       example: '+1234567890'
 *                     phone_code:
 *                       type: integer
 *                       description: The updated phone code for the contact number.
 *                       example: 1
 *       400:
 *         description: Bad request - Missing or invalid parameters (e.g., invalid email format, phone code not provided).
 *       401:
 *         description: Unauthorized - Authentication required or invalid token.
 *       422:
 *         description: Unprocessable Entity - Validation errors, such as missing required fields.
 *       500:
 *         description: Internal server error - Server-side issues during the profile update process.
 */

/**
 * @swagger
 * /user/contact:
 *   post:
 *     summary: Contact form submission
 *     description: Allows users to submit a contact form with their name, email, phone number, and optional description and captcha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name submitting the contact form.
 *                 example: 'John Doe'
 *               description:
 *                 type: string
 *                 description: Optional field to describe the reason for contact.
 *                 example: 'Inquiry about product availability'
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: 'john.doe@example.com'
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: '+1234567890'
 *               captcha:
 *                 type: string
 *                 description: The captcha verification response provided by the user.
 *                 example: 'captcha-response-string'
 *     responses:
 *       200:
 *         description: Contact form submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message after form submission.
 *                   example: 'Contact form submitted successfully.'
 *       400:
 *         description: Bad request - Missing or invalid parameters (e.g., invalid email format, missing name or captcha).
 *       422:
 *         description: Unprocessable Entity - Validation errors, such as missing required fields.
 *       500:
 *         description: Internal server error - Server-side issues while processing the contact form.
 */

/**
 * @swagger
 * /user/payment/create-checkout-session:
 *   post:
 *     summary: Process a payment
 *     description: Initiates the payment process using the provided priceId. The priceId corresponds to a specific pricing plan or amount.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceId:
 *                 type: string
 *                 description: The unique identifier for the pricing plan or amount to be paid.
 *                 example: 'price_1HhXbK2eZvKYlo2Cz8'
 *     responses:
 *       200:
 *         description: Payment processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the payment was processed.
 *                   example: 'Payment processed successfully.'
 *                 paymentId:
 *                   type: string
 *                   description: The unique payment ID generated for the transaction.
 *                   example: 'pay_1HhXbK2eZvKYlo2Cz9'
 *       400:
 *         description: Bad request - Missing or invalid `priceId` parameter.
 *       422:
 *         description: Unprocessable Entity - Validation failed, such as missing required fields.
 *       500:
 *         description: Internal server error - Server-side issues while processing the payment.
 */

/**
 * @swagger
 * /webhook/stripe/sync-subscription:
 *   post:
 *     summary: Synchronize subscription with Stripe webhook
 *     description: This endpoint is used to handle incoming Stripe webhook events related to subscription updates and synchronize the subscription status in your system.
 *     operationId: syncStripeSubscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique identifier for the event.
 *                 example: 'evt_1Iv3Yp2eZvKYlo2CB9Xyz'
 *               object:
 *                 type: string
 *                 description: The type of the Stripe event (e.g., `invoice.payment_succeeded`, `customer.subscription.updated`).
 *                 example: 'customer.subscription.updated'
 *               data:
 *                 type: object
 *                 properties:
 *                   object:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier for the Stripe subscription.
 *                         example: 'sub_1Iv3Wf2eZvKYlo2CbZj2wVbS'
 *                       status:
 *                         type: string
 *                         description: The subscription status (e.g., `active`, `canceled`).
 *                         example: 'active'
 *                       plan:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier for the Stripe pricing plan.
 *                             example: 'plan_GzF9XzV8z'
 *                           amount:
 *                             type: integer
 *                             description: The amount of the subscription plan.
 *                             example: 1500
 *                           currency:
 *                             type: string
 *                             description: The currency of the subscription amount.
 *                             example: 'usd'
 *     responses:
 *       200:
 *         description: Successfully synchronized subscription data from Stripe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message after synchronization.
 *                   example: 'Subscription synchronized successfully.'
 *       400:
 *         description: Bad request - Invalid or missing webhook payload data.
 *       422:
 *         description: Unprocessable Entity - Webhook event validation failed.
 *       500:
 *         description: Internal server error - Issues with processing the Stripe webhook.
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Logs an admin user into the system using their email and password. This returns a token that can be used for authentication in future requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The admin's email address.
 *                 example: 'admin@example.com'
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Admin successfully logged in. Returns an authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The authentication token for the admin.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJpYXQiOjE2MjM2NTMwNjQsImV4cCI6MTYyMzY4OTA2NCwidGVuYW50IjoiYWRtaW4ifQ.JqgXTfHgG3GpLpfLDQYVv1gdyFLd_e2RbmABcdDGTjE'
 *       400:
 *         description: Bad request - Invalid or missing `email` or `password`.
 *       401:
 *         description: Unauthorized - Invalid email or password.
 *       500:
 *         description: Internal server error - Issues with login processing.
 */

/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Admin user signup
 *     description: Registers a new admin user with the provided details. The admin must agree to the terms before signing up.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the admin user.
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The admin's email address.
 *                 example: 'admin@example.com'
 *               password:
 *                 type: string
 *                 description: The password for the admin account.
 *                 example: 'password123'
 *               is_agreed:
 *                 type: boolean
 *                 description: Whether the admin agrees to the terms and conditions.
 *                 example: true
 *     responses:
 *       201:
 *         description: Admin user successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the user was created.
 *                   example: 'Admin user created successfully.'
 *       400:
 *         description: Bad request - Invalid or missing required fields.
 *       409:
 *         description: Conflict - An admin with the given email already exists.
 *       500:
 *         description: Internal server error - Issues with the signup process.
 */

/**
 * @swagger
 * /admin/2fa-login:
 *   post:
 *     summary: Admin 2FA login
 *     description: This route is used to verify the second factor authentication (2FA) code for admin users after they have logged in with their credentials. It requires the `user_id` and `code` (2FA code) to complete the authentication process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The unique identifier of the admin user.
 *                 example: '605c72ef153207001f8b465'
 *               code:
 *                 type: string
 *                 description: The 2FA code sent to the admin's authentication method (e.g., email, SMS, or app).
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: 2FA verification successful. Returns a JWT token for further requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The authentication token for the admin.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJpYXQiOjE2MjM2NTMwNjQsImV4cCI6MTYyMzY4OTA2NCwidGVuYW50IjoiYWRtaW4ifQ.JqgXTfHgG3GpLpfLDQYVv1gdyFLd_e2RbmABcdDGTjE'
 *       400:
 *         description: Bad request - Invalid or missing `user_id` or `code`.
 *       401:
 *         description: Unauthorized - Invalid or expired 2FA code.
 *       404:
 *         description: Not Found - Admin user not found.
 *       500:
 *         description: Internal server error - Issues with verifying the 2FA code.
 */

/**
 * @swagger
 * /admin/resend-code/{user_id}:
 *   post:
 *     summary: Resend OTP code to the user
 *     description: This route allows the system to resend the OTP (One-Time Password) code to the specified user identified by their `user_id`. This is typically used in case the user didn't receive or lost the OTP.
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: The unique identifier of the user to whom the OTP code should be resent.
 *         required: true
 *         schema:
 *           type: string
 *           example: '605c72ef153207001f8b465'
 *     responses:
 *       200:
 *         description: OTP code successfully resent to the user's email or phone.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the OTP was resent.
 *                   example: 'OTP code has been resent successfully.'
 *       400:
 *         description: Bad request - The `user_id` is invalid or missing.
 *       404:
 *         description: Not Found - User not found with the provided `user_id`.
 *       500:
 *         description: Internal server error - Issues with resending the OTP code.
 */

/**
 * @swagger
 * /admin/edit-profile:
 *   post:
 *     summary: Edit admin profile
 *     description: This route allows an admin user to update their profile information such as full name, contact number, phone code, profile photo, and address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: The full name of the admin user.
 *                 example: 'Jane Doe'
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the admin user.
 *                 example: '+1234567890'
 *               phone_code:
 *                 type: string
 *                 description: The phone code (country code) for the admin user.
 *                 example: '1'
 *               profile_photo:
 *                 type: string
 *                 description: A URL or file path to the admin's profile photo (optional).
 *                 example: 'https://example.com/images/profile.jpg'
 *               address:
 *                 type: string
 *                 description: The address of the admin user (optional).
 *                 example: '123 Admin St, Admin City, Admin Country'
 *     responses:
 *       200:
 *         description: Admin profile successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the profile was updated.
 *                   example: 'Profile updated successfully.'
 *       400:
 *         description: Bad request - Missing or invalid required fields.
 *       404:
 *         description: Not Found - Admin user not found.
 *       500:
 *         description: Internal server error - Unable to update the profile.
 */

/**
 * @swagger
 * /admin/change-password:
 *   post:
 *     summary: Change admin password
 *     description: This route allows an admin user to change their password by providing the old password and a new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: The current password of the admin user.
 *                 example: 'currentPassword123'
 *               new_password:
 *                 type: string
 *                 description: The new password that the admin user wants to set.
 *                 example: 'newPassword456'
 *     responses:
 *       200:
 *         description: Password successfully changed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the password was updated.
 *                   example: 'Password changed successfully.'
 *       400:
 *         description: Bad request - Validation error or missing fields.
 *       401:
 *         description: Unauthorized - The old password is incorrect.
 *       500:
 *         description: Internal server error - Unable to change the password.
 */

/**
 * @swagger
 * /admin/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: This route allows an admin to request a password reset by providing their email address. A password reset link or OTP will be sent to the provided email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the admin user requesting a password reset.
 *                 example: 'admin@example.com'
 *     responses:
 *       200:
 *         description: Password reset instructions sent to the email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the reset instructions were sent.
 *                   example: 'Password reset instructions sent to your email.'
 *       400:
 *         description: Bad request - Invalid or missing email.
 *       404:
 *         description: Not Found - No user found with the provided email.
 *       500:
 *         description: Internal server error - Failed to send reset instructions.
 */

/**
 * @swagger
 * /admin/reset-password:
 *   post:
 *     summary: Reset admin password
 *     description: This route allows an admin to reset their password using a valid reset token. The admin must provide the token (received via email) and the new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The reset token sent to the admin's email address.
 *                 example: 'abc123reset-tokenxyz'
 *               password:
 *                 type: string
 *                 description: The new password that the admin wants to set.
 *                 example: 'newPassword123!'
 *     responses:
 *       200:
 *         description: Password successfully reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the password was successfully reset.
 *                   example: 'Password has been successfully reset.'
 *       400:
 *         description: Bad request - Invalid or missing token or password.
 *       404:
 *         description: Not Found - Invalid or expired reset token.
 *       500:
 *         description: Internal server error - Failed to reset the password.
 */

/**
 * @swagger
 * /admin/users/list:
 *   get:
 *     summary: Get a list of users
 *     description: This route retrieves a paginated list of users with optional search, sorting, and filtering capabilities (e.g., fetching only users in the trash).
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: number
 *           description: The number of users to retrieve per page.
 *           example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: number
 *           description: The number of users to skip for pagination purposes.
 *           example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           description: A search term to filter users by name, email, or other fields.
 *           example: 'john@example.com'
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           description: A field to sort the users by (e.g., name, email). Use a minus sign (e.g., '-name') for descending order.
 *           example: 'name'
 *       - in: query
 *         name: trashOnly
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, '']
 *           description: A filter to get only users that are in the trash. If not provided, all users are returned.
 *           example: 'true'
 *     responses:
 *       200:
 *         description: A list of users with pagination and optional filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The total number of users available.
 *                   example: 100
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID.
 *                         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                       email:
 *                         type: string
 *                         description: The user's email address.
 *                         example: 'john@example.com'
 *                       name:
 *                         type: string
 *                         description: The user's full name.
 *                         example: 'John Doe'
 *                       isDeleted:
 *                         type: boolean
 *                         description: Whether the user is marked as deleted (in trash).
 *                         example: false
 *       400:
 *         description: Bad request - Invalid or missing query parameters.
 *       500:
 *         description: Internal server error - Failed to retrieve users.
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: This route retrieves the details of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to retrieve.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     responses:
 *       200:
 *         description: The details of the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 email:
 *                   type: string
 *                   description: The user's email address.
 *                   example: 'john@example.com'
 *                 name:
 *                   type: string
 *                   description: The user's full name.
 *                   example: 'John Doe'
 *                 isDeleted:
 *                   type: boolean
 *                   description: Whether the user is marked as deleted.
 *                   example: false
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a specific user by ID
 *     description: This route updates the details of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to update.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: 'john.doe@example.com'
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: 'Johnathan Doe'
 *               contact_number:
 *                 type: string
 *                 description: The user's contact number.
 *                 example: '+1234567890'
 *               isDeleted:
 *                 type: boolean
 *                 description: Whether the user is marked as deleted.
 *                 example: false
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the user was updated.
 *                   example: 'User updated successfully.'
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a specific user by ID
 *     description: This route deletes a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to delete.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the user was deleted.
 *                   example: 'User deleted successfully.'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/users/add:
 *   post:
 *     summary: Add a new user
 *     description: This route adds a new user to the system with required and optional details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: 'john.doe@example.com'
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., 'admin', 'user').
 *                 example: 'user'
 *               full_name:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: 'John Doe'
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the user.
 *                 example: '+1234567890'
 *               phone_code:
 *                 type: string
 *                 description: The phone code for the user's contact number.
 *                 example: 'US'
 *               country_code:
 *                 type: string
 *                 description: The country code (e.g., 'US', 'IN').
 *                 example: 'US'
 *               address:
 *                 type: string
 *                 description: The address of the user (optional).
 *                 example: '1234 Elm Street'
 *               status:
 *                 type: string
 *                 description: The status of the user (e.g., 'active', 'inactive').
 *                 example: 'active'
 *               profile_photo:
 *                 type: string
 *                 description: The URL of the user's profile photo (optional).
 *                 example: 'https://example.com/photo.jpg'
 *               profile_photo_data:
 *                 type: string
 *                 description: The base64 encoded data for the user's profile photo (optional).
 *                 example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAP8A...'
 *               password:
 *                 type: string
 *                 description: The password for the new user (optional).
 *                 example: 'password123'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the user was added.
 *                   example: 'User added successfully.'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the created user.
 *                       example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                     email:
 *                       type: string
 *                       description: The email of the created user.
 *                       example: 'john.doe@example.com'
 *       400:
 *         description: Bad request - Invalid input data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/users/edit/{id}:
 *   put:
 *     summary: Update an existing user by ID
 *     description: This route allows the admin to update the information of an existing user identified by their unique `id`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to update.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: 'john.doe@example.com'
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., 'admin', 'user').
 *                 example: 'user'
 *               full_name:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: 'John Doe'
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the user.
 *                 example: '+1234567890'
 *               phone_code:
 *                 type: string
 *                 description: The phone code for the user's contact number.
 *                 example: 'US'
 *               country_code:
 *                 type: string
 *                 description: The country code (e.g., 'US', 'IN').
 *                 example: 'US'
 *               address:
 *                 type: string
 *                 description: The address of the user (optional).
 *                 example: '1234 Elm Street'
 *               status:
 *                 type: string
 *                 description: The status of the user (e.g., 'active', 'inactive').
 *                 example: 'active'
 *               profile_photo:
 *                 type: string
 *                 description: The URL of the user's profile photo (optional).
 *                 example: 'https://example.com/photo.jpg'
 *               profile_photo_data:
 *                 type: string
 *                 description: The base64 encoded data for the user's profile photo (optional).
 *                 example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAP8A...'
 *               password:
 *                 type: string
 *                 description: The password for the user (optional).
 *                 example: 'newpassword123'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the user was updated.
 *                   example: 'User updated successfully.'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the updated user.
 *                       example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                     email:
 *                       type: string
 *                       description: The email of the updated user.
 *                       example: 'john.doe@example.com'
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/users/delete:
 *   post:
 *     summary: Delete multiple users by IDs
 *     description: This route allows the admin to delete multiple users by providing an array of user IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: A list of user IDs to delete.
 *                 items:
 *                   type: string
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     responses:
 *       200:
 *         description: Users deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the users were deleted.
 *                   example: 'Users deleted successfully.'
 *                 deletedIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of IDs of the successfully deleted users.
 *                   example: ['60b8d7d7f1c4f95f1a1a1a1a', '60b8d7d7f1c4f95f1a1a1b2b']
 *       400:
 *         description: Bad request - Invalid input data.
 *       404:
 *         description: Users not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/permissions/add:
 *   post:
 *     summary: Add a new permission
 *     description: This route allows the admin to add a new permission with a `name`, `description`, and `active` status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission.
 *                 example: 'view_dashboard'
 *               description:
 *                 type: string
 *                 description: A brief description of the permission (optional).
 *                 example: 'Allows viewing the dashboard.'
 *               active:
 *                 type: boolean
 *                 description: Indicates whether the permission is active.
 *                 example: true
 *     responses:
 *       201:
 *         description: Permission created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the permission was created.
 *                   example: 'Permission created successfully.'
 *                 permission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the created permission.
 *                       example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                     name:
 *                       type: string
 *                       description: The name of the created permission.
 *                       example: 'view_dashboard'
 *                     description:
 *                       type: string
 *                       description: The description of the created permission.
 *                       example: 'Allows viewing the dashboard.'
 *                     active:
 *                       type: boolean
 *                       description: The active status of the created permission.
 *                       example: true
 *       400:
 *         description: Bad request - Invalid input data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/permissions/list:
 *   get:
 *     summary: Get a list of permissions
 *     description: This route allows the admin to get a list of all permissions with optional filtering, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of permissions to return per page (pagination size).
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: The number of permissions to skip for pagination (used with `size`).
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: 'view_dashboard'
 *         description: A search term to filter permissions by name or description.
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           example: 'name:asc'
 *         description: A sorting parameter to sort by a field (e.g., `name:asc`, `name:desc`).
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filter permissions by active status.
 *     responses:
 *       200:
 *         description: A list of permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of permissions in the database.
 *                   example: 50
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique ID of the permission.
 *                         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                       name:
 *                         type: string
 *                         description: The name of the permission.
 *                         example: 'view_dashboard'
 *                       description:
 *                         type: string
 *                         description: The description of the permission.
 *                         example: 'Allows viewing the dashboard.'
 *                       active:
 *                         type: boolean
 *                         description: Indicates whether the permission is active.
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the permission was created.
 *                         example: '2023-01-01T12:00:00Z'
 *       400:
 *         description: Bad request - Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/permissions/{id}:
 *   get:
 *     summary: Get a specific permission by ID
 *     description: Fetch the details of a permission by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to retrieve.
 *     responses:
 *       200:
 *         description: Successfully fetched the permission details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the permission.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The name of the permission.
 *                   example: 'view_dashboard'
 *                 description:
 *                   type: string
 *                   description: The description of the permission.
 *                   example: 'Allows viewing the dashboard.'
 *                 active:
 *                   type: boolean
 *                   description: Whether the permission is active.
 *                   example: true
 *       404:
 *         description: Permission not found.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     summary: Update a specific permission by ID
 *     description: Update the details of a permission based on its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission.
 *                 example: 'view_dashboard'
 *               description:
 *                 type: string
 *                 description: A description of the permission.
 *                 example: 'Allows viewing the dashboard.'
 *               active:
 *                 type: boolean
 *                 description: Whether the permission is active.
 *                 example: true
 *     responses:
 *       200:
 *         description: Permission updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: 'Permission updated successfully.'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Permission not found.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a specific permission by ID
 *     description: Delete a permission by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to delete.
 *     responses:
 *       200:
 *         description: Permission deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: 'Permission deleted successfully.'
 *       404:
 *         description: Permission not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/permissions/edit/{id}:
 *   put:
 *     summary: Edit a specific permission by ID
 *     description: This route allows the admin to edit an existing permission by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the permission to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission.
 *                 example: 'view_dashboard'
 *               description:
 *                 type: string
 *                 description: A description of the permission.
 *                 example: 'Allows viewing the dashboard.'
 *               active:
 *                 type: boolean
 *                 description: Whether the permission is active.
 *                 example: true
 *             required:
 *               - name
 *               - active
 *     responses:
 *       200:
 *         description: Successfully updated the permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the permission was updated.
 *                   example: 'Permission updated successfully.'
 *       400:
 *         description: Bad request - Invalid data or missing required fields.
 *       404:
 *         description: Permission not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/permissions/delete:
 *   delete:
 *     summary: Delete multiple permissions by their IDs
 *     description: This route allows the admin to delete multiple permissions by providing an array of permission IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of permission IDs to delete.
 *                 example: ['60b8d7d7f1c4f95f1a1a1a1a', '60b8d7d7f1c4f95f1a1a1a2b']
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Successfully deleted the permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the permissions were deleted.
 *                   example: 'Permissions deleted successfully.'
 *       400:
 *         description: Bad request - Invalid input or missing `ids` field.
 *       404:
 *         description: One or more permissions not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/roles/add:
 *   post:
 *     summary: Create a new role with associated permissions
 *     description: This route allows the admin to create a new role by providing the role's name, description, permissions, and active status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role.
 *                 example: 'Admin'
 *               description:
 *                 type: string
 *                 description: A brief description of the role.
 *                 example: 'Administrator role with full access'
 *               role_permissions:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     create:
 *                       type: boolean
 *                       description: Whether the role has permission to create resources.
 *                       example: true
 *                     read:
 *                       type: boolean
 *                       description: Whether the role has permission to read resources.
 *                       example: true
 *                     update:
 *                       type: boolean
 *                       description: Whether the role has permission to update resources.
 *                       example: true
 *                     delete:
 *                       type: boolean
 *                       description: Whether the role has permission to delete resources.
 *                       example: true
 *               active:
 *                 type: boolean
 *                 description: Whether the role is active or not.
 *                 default: true
 *                 example: true
 *             required:
 *               - name
 *               - role_permissions
 *     responses:
 *       201:
 *         description: Successfully created the role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the role was created.
 *                   example: 'Role created successfully.'
 *       400:
 *         description: Bad request - Invalid data or missing required fields.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/roles/list:
 *   get:
 *     summary: Get a list of roles
 *     description: This route retrieves a paginated list of roles. You can optionally filter, search, and sort the roles.
 *     parameters:
 *       - name: size
 *         in: query
 *         description: Number of roles to return per page.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: skip
 *         in: query
 *         description: Number of roles to skip for pagination.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *       - name: search
 *         in: query
 *         description: Search query to filter roles by name or description.
 *         required: false
 *         schema:
 *           type: string
 *           example: 'Admin'
 *       - name: sorting
 *         in: query
 *         description: Sorting order of the roles (e.g., `name`, `active`).
 *         required: false
 *         schema:
 *           type: string
 *           example: 'name'
 *       - name: trashOnly
 *         in: query
 *         description: Whether to only include roles marked as "trashed".
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['true', '']
 *           example: ''
 *     responses:
 *       200:
 *         description: Successfully fetched the list of roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the role.
 *                       name:
 *                         type: string
 *                         description: The name of the role.
 *                       description:
 *                         type: string
 *                         description: A description of the role.
 *                       active:
 *                         type: boolean
 *                         description: Whether the role is active.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date the role was created.
 *                 total:
 *                   type: integer
 *                   description: The total number of roles available.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: 'Roles fetched successfully.'
 *       400:
 *         description: Bad request - Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/roles/get/{id}:
 *   get:
 *     summary: Get a role by its ID
 *     description: This route retrieves a specific role by its unique identifier (`id`).
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the role.
 *         required: true
 *         schema:
 *           type: string
 *           example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     responses:
 *       200:
 *         description: Successfully fetched the role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the role.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The name of the role.
 *                   example: 'Admin'
 *                 description:
 *                   type: string
 *                   description: A description of the role.
 *                   example: 'Administrator role with full access'
 *                 active:
 *                   type: boolean
 *                   description: Whether the role is active.
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date the role was created.
 *                   example: '2021-08-01T12:00:00Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date the role was last updated.
 *                   example: '2021-08-10T12:00:00Z'
 *       404:
 *         description: Role not found with the given ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/roles/edit/{id}:
 *   put:
 *     summary: Edit a role by its ID
 *     description: This route allows updating an existing role's details by providing the role's unique `id` and updated information in the request body.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the role to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role.
 *                 example: 'Admin'
 *               description:
 *                 type: string
 *                 description: A description of the role.
 *                 example: 'Administrator role with full access.'
 *               role_permissions:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     create:
 *                       type: boolean
 *                       example: true
 *                     read:
 *                       type: boolean
 *                       example: true
 *                     update:
 *                       type: boolean
 *                       example: true
 *                     delete:
 *                       type: boolean
 *                       example: true
 *               active:
 *                 type: boolean
 *                 description: Whether the role is active.
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the role.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The updated name of the role.
 *                   example: 'Admin'
 *                 description:
 *                   type: string
 *                   description: The updated description of the role.
 *                   example: 'Administrator role with full access.'
 *                 role_permissions:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                         example: true
 *                       read:
 *                         type: boolean
 *                         example: true
 *                       update:
 *                         type: boolean
 *                         example: true
 *                       delete:
 *                         type: boolean
 *                         example: true
 *                 active:
 *                   type: boolean
 *                   description: Whether the role is active.
 *                   example: true
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date the role was last updated.
 *                   example: '2021-08-10T12:00:00Z'
 *       400:
 *         description: Bad request - Invalid request body or missing required fields.
 *       404:
 *         description: Role not found with the given ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/roles/delete:
 *   delete:
 *     summary: Delete multiple roles by their IDs
 *     description: This route deletes multiple roles based on the provided array of role IDs in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The unique identifier of the role to be deleted.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 description: Array of role IDs to be deleted.
 *     responses:
 *       200:
 *         description: Successfully deleted the roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: number
 *                   description: The number of roles successfully deleted.
 *                   example: 3
 *       400:
 *         description: Bad request - Invalid request body or missing `ids` array.
 *       404:
 *         description: One or more roles not found with the provided IDs.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/subjects/add:
 *   post:
 *     summary: Add a new subject
 *     description: This route adds a new subject by providing the subject details such as name, description, and active status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the subject.
 *                 example: 'Mathematics'
 *               description:
 *                 type: string
 *                 description: A brief description of the subject.
 *                 example: 'The study of numbers, shapes, and patterns.'
 *               active:
 *                 type: boolean
 *                 description: The active status of the subject.
 *                 example: true
 *     responses:
 *       201:
 *         description: Successfully added the new subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the newly created subject.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The name of the subject.
 *                   example: 'Mathematics'
 *                 description:
 *                   type: string
 *                   description: The description of the subject.
 *                   example: 'The study of numbers, shapes, and patterns.'
 *                 active:
 *                   type: boolean
 *                   description: The active status of the subject.
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date when the subject was created.
 *                   example: '2021-08-10T12:00:00Z'
 *       400:
 *         description: Bad request - Invalid request body or missing required fields.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/subjects/list:
 *   get:
 *     summary: Get a list of subjects with pagination and search
 *     description: This route returns a list of subjects with optional pagination and search functionality. You can filter the list by providing a search term.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The number of subjects to return per page.
 *         example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: The number of subjects to skip (used for pagination).
 *         example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: A search term to filter subjects by name or description.
 *         example: 'Math'
 *     responses:
 *       200:
 *         description: A list of subjects matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of subjects available.
 *                   example: 100
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the subject.
 *                         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                       name:
 *                         type: string
 *                         description: The name of the subject.
 *                         example: 'Mathematics'
 *                       description:
 *                         type: string
 *                         description: A brief description of the subject.
 *                         example: 'The study of numbers, shapes, and patterns.'
 *                       active:
 *                         type: boolean
 *                         description: The active status of the subject.
 *                         example: true
 *                 pageInfo:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                       description: The number of subjects per page.
 *                       example: 10
 *                     skip:
 *                       type: integer
 *                       description: The number of subjects skipped for pagination.
 *                       example: 0
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages based on the current query.
 *                       example: 10
 *       400:
 *         description: Bad request - Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/subject/get/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     description: This route retrieves a subject by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the subject.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     responses:
 *       200:
 *         description: Successfully retrieved the subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the subject.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The name of the subject.
 *                   example: 'Mathematics'
 *                 description:
 *                   type: string
 *                   description: A brief description of the subject.
 *                   example: 'The study of numbers, shapes, and patterns.'
 *                 active:
 *                   type: boolean
 *                   description: The active status of the subject.
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date when the subject was created.
 *                   example: '2021-08-10T12:00:00Z'
 *       404:
 *         description: Subject not found - The subject with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/subjects/edit/{id}:
 *   put:
 *     summary: Update a subject by ID
 *     description: This route allows you to update a subject's information by its unique ID. You can update the subject's name, description, and active status.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the subject to be updated.
 *         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the subject.
 *                 example: 'Physics'
 *               description:
 *                 type: string
 *                 description: A brief description of the subject.
 *                 example: 'The study of matter and energy.'
 *               active:
 *                 type: boolean
 *                 description: The active status of the subject.
 *                 example: true
 *             required:
 *               - name
 *               - active
 *     responses:
 *       200:
 *         description: Successfully updated the subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the subject.
 *                   example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                 name:
 *                   type: string
 *                   description: The updated name of the subject.
 *                   example: 'Physics'
 *                 description:
 *                   type: string
 *                   description: The updated description of the subject.
 *                   example: 'The study of matter and energy.'
 *                 active:
 *                   type: boolean
 *                   description: The updated active status of the subject.
 *                   example: true
 *       400:
 *         description: Bad request - Invalid data provided.
 *       404:
 *         description: Subject not found - The subject with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/subjects/delete:
 *   delete:
 *     summary: Delete multiple subjects by their IDs
 *     description: This route deletes multiple subjects based on the provided array of subject IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of subject IDs to be deleted.
 *                 example: ["60b8d7d7f1c4f95f1a1a1a1a", "60b8d7d7f1c4f95f1a1a1a2a"]
 *     responses:
 *       200:
 *         description: Successfully deleted the subjects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of the deleted subjects.
 *                   example: "Successfully deleted 2 subjects."
 *       400:
 *         description: Bad request - No IDs provided or invalid data format.
 *       404:
 *         description: Not found - One or more subjects with the given IDs do not exist.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/list:
 *   get:
 *     summary: Get a list of course categories
 *     description: This route retrieves a list of course categories with pagination, optional search, and sorting.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of course categories to return per page.
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: The number of course categories to skip (for pagination).
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: 'Math'
 *         description: The search term to filter course categories by name or description.
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           example: 'name:asc'
 *         description: "The sorting order of the results. Example: 'name:asc' or 'created_at:desc'."
 *     responses:
 *       200:
 *         description: A list of course categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of course categories available.
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the course category.
 *                         example: '60b8d7d7f1c4f95f1a1a1a1a'
 *                       name:
 *                         type: string
 *                         description: The name of the course category.
 *                         example: 'Mathematics'
 *                       description:
 *                         type: string
 *                         description: A brief description of the course category.
 *                         example: 'Courses related to mathematics.'
 *                       active:
 *                         type: boolean
 *                         description: The active status of the course category.
 *                         example: true
 *       400:
 *         description: Bad request - Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/get/{id}:
 *   get:
 *     summary: Get a specific course category by ID
 *     description: This route retrieves a single course category based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the course category.
 *         example: "60b8d7d7f1c4f95f1a1a1a1a"
 *     responses:
 *       200:
 *         description: Successfully retrieved the course category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the course category.
 *                   example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                 name:
 *                   type: string
 *                   description: The name of the course category.
 *                   example: "Mathematics"
 *                 description:
 *                   type: string
 *                   description: A description of the course category.
 *                   example: "Courses related to mathematics."
 *                 active:
 *                   type: boolean
 *                   description: The active status of the course category.
 *                   example: true
 *       404:
 *         description: Course category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/edit/{id}:
 *   put:
 *     summary: Edit a specific course category by ID
 *     description: This route allows updating an existing course category by its ID. Fields that can be updated include name, description, active status, and image details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the course category to update.
 *         example: "60b8d7d7f1c4f95f1a1a1a1a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course category.
 *                 example: "Advanced Mathematics"
 *               description:
 *                 type: string
 *                 description: A brief description of the course category.
 *                 example: "Courses focused on advanced mathematical concepts."
 *               active:
 *                 type: boolean
 *                 description: The active status of the course category.
 *                 example: true
 *               image:
 *                 type: string
 *                 description: The URL of the course category image.
 *                 example: "https://example.com/path/to/image.jpg"
 *               image_data:
 *                 type: string
 *                 description: The base64 encoded image data.
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAA..."
 *     responses:
 *       200:
 *         description: Successfully updated the course category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the course category.
 *                   example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                 name:
 *                   type: string
 *                   description: The name of the course category.
 *                   example: "Advanced Mathematics"
 *                 description:
 *                   type: string
 *                   description: The updated description of the course category.
 *                   example: "Courses focused on advanced mathematical concepts."
 *                 active:
 *                   type: boolean
 *                   description: The active status of the course category.
 *                   example: true
 *       400:
 *         description: Bad request — Invalid input data.
 *       404:
 *         description: Course category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/delete:
 *   delete:
 *     summary: Delete multiple course categories by IDs
 *     description: This route deletes multiple course categories by their unique IDs. The request body should contain an array of `ids[]` representing the course categories to be deleted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of unique IDs representing the course categories to delete.
 *                 example: ["60b8d7d7f1c4f95f1a1a1a1a", "60b8d7d7f1c4f95f1a1a1a2b"]
 *     responses:
 *       200:
 *         description: Successfully deleted the course categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of course categories successfully deleted.
 *                   example: 2
 *       400:
 *         description: Bad request — Invalid input data.
 *       404:
 *         description: One or more course categories not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/add:
 *   post:
 *     summary: Add a new course category
 *     description: This route adds a new course category. The request body should contain the details of the category, including name, description, active status, and optional image details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course category.
 *                 example: "Data Science"
 *               description:
 *                 type: string
 *                 description: A brief description of the course category.
 *                 example: "Courses focused on data science and analytics."
 *               active:
 *                 type: boolean
 *                 description: The active status of the course category.
 *                 example: true
 *               image:
 *                 type: string
 *                 description: The URL of the course category image.
 *                 example: "https://example.com/path/to/image.jpg"
 *               image_data:
 *                 type: string
 *                 description: The base64 encoded image data for the course category image.
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAA..."
 *     responses:
 *       201:
 *         description: Successfully created the course category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the course category.
 *                   example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                 name:
 *                   type: string
 *                   description: The name of the course category.
 *                   example: "Data Science"
 *                 description:
 *                   type: string
 *                   description: The description of the course category.
 *                   example: "Courses focused on data science and analytics."
 *                 active:
 *                   type: boolean
 *                   description: The active status of the course category.
 *                   example: true
 *       400:
 *         description: Bad request — Invalid input data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/course-categories/list:
 *   get:
 *     summary: Retrieve a list of course categories
 *     description: This route retrieves a list of course categories with pagination, optional search, and sorting capabilities.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of items to return per page.
 *         example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of items to skip (for pagination).
 *         example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: A search term to filter the course categories by name or description.
 *         example: "Data"
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *         description: "The sorting order. Possible values: 'asc', 'desc'."
 *         example: "asc"
 *     responses:
 *       200:
 *         description: A list of course categories matching the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: number
 *                   description: The total number of course categories available.
 *                   example: 100
 *                 courseCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the course category.
 *                         example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                       name:
 *                         type: string
 *                         description: The name of the course category.
 *                         example: "Data Science"
 *                       description:
 *                         type: string
 *                         description: The description of the course category.
 *                         example: "Courses focused on data science and analytics."
 *                       active:
 *                         type: boolean
 *                         description: Whether the course category is active or not.
 *                         example: true
 *       400:
 *         description: Bad request — Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/courses/list:
 *   get:
 *     summary: Retrieve a list of courses
 *     description: This route retrieves a list of courses with pagination and an optional search filter.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of items to return per page.
 *         example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of items to skip (for pagination).
 *         example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: A search term to filter the courses by title or description.
 *         example: "JavaScript"
 *     responses:
 *       200:
 *         description: A list of courses matching the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: number
 *                   description: The total number of courses available.
 *                   example: 50
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the course.
 *                         example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                       title:
 *                         type: string
 *                         description: The title of the course.
 *                         example: "JavaScript Basics"
 *                       description:
 *                         type: string
 *                         description: The description of the course.
 *                         example: "A beginner course to learn JavaScript."
 *                       active:
 *                         type: boolean
 *                         description: Whether the course is active or not.
 *                         example: true
 *                       price:
 *                         type: number
 *                         description: The price of the course.
 *                         example: 49.99
 *       400:
 *         description: Bad request — Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/courses/get/{id}:
 *   get:
 *     summary: Retrieve a single course by ID
 *     description: This route retrieves a specific course based on the provided course ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the course.
 *         example: "60b8d7d7f1c4f95f1a1a1a1a"
 *     responses:
 *       200:
 *         description: A course object with the requested ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the course.
 *                   example: "60b8d7d7f1c4f95f1a1a1a1a"
 *                 title:
 *                   type: string
 *                   description: The title of the course.
 *                   example: "JavaScript Basics"
 *                 description:
 *                   type: string
 *                   description: The description of the course.
 *                   example: "A beginner course to learn JavaScript."
 *                 active:
 *                   type: boolean
 *                   description: Whether the course is active or not.
 *                   example: true
 *                 price:
 *                   type: number
 *                   description: The price of the course.
 *                   example: 49.99
 *       404:
 *         description: Course not found for the given ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/courses/add:
 *   post:
 *     summary: Add a new course
 *     description: This route is used to add a new course to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course.
 *                 example: "JavaScript Basics"
 *               description:
 *                 type: string
 *                 description: A brief description of the course.
 *                 example: "An introductory course to learn JavaScript."
 *               image:
 *                 type: string
 *                 description: A URL or path to an image representing the course (optional).
 *                 example: "https://example.com/image.png"
 *               image_data:
 *                 type: string
 *                 description: Base64 encoded image data for the course (optional).
 *                 example: "data:image/png;base64, ..."
 *               category:
 *                 type: string
 *                 description: The category ID the course belongs to (required).
 *                 example: "60b8d7d7f1c4f95f1a1a1a1a"
 *               active:
 *                 type: boolean
 *                 description: Whether the course is active or not.
 *                 example: true
 *               level:
 *                 type: string
 *                 description: The difficulty level of the course.
 *                 enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
 *                 example: "BEGINNER"
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Subject IDs the course is related to (array of string).
 *                   example: ["60b8d7d7f1c4f95f1a1a1a2b", "60b8d7d7f1c4f95f1a1a1a3c"]
 *     responses:
 *       201:
 *         description: Course successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the newly created course.
 *                   example: "60b8d7d7f1c4f95f1a1a1a4d"
 *                 name:
 *                   type: string
 *                   description: The name of the course.
 *                   example: "JavaScript Basics"
 *                 description:
 *                   type: string
 *                   description: The description of the course.
 *                   example: "An introductory course to learn JavaScript."
 *                 active:
 *                   type: boolean
 *                   description: Whether the course is active.
 *                   example: true
 *                 level:
 *                   type: string
 *                   description: The difficulty level of the course.
 *                   example: "BEGINNER"
 *       400:
 *         description: Bad request — Invalid course data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/courses/edit/{id}:
 *   post:
 *     summary: Edit an existing course
 *     description: This route is used to edit an existing course's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the course to be edited.
 *         schema:
 *           type: string
 *           example: "60b8d7d7f1c4f95f1a1a1a4d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course.
 *                 example: "Advanced JavaScript"
 *               description:
 *                 type: string
 *                 description: A brief description of the course.
 *                 example: "An advanced course to deepen your JavaScript knowledge."
 *               image:
 *                 type: string
 *                 description: A URL or path to an image representing the course (optional).
 *                 example: "https://example.com/new-image.png"
 *               image_data:
 *                 type: string
 *                 description: Base64 encoded image data for the course (optional).
 *                 example: "data:image/png;base64, ..."
 *               category:
 *                 type: string
 *                 description: The category ID the course belongs to (required).
 *                 example: "60b8d7d7f1c4f95f1a1a1a2b"
 *               active:
 *                 type: boolean
 *                 description: Whether the course is active or not.
 *                 example: true
 *               level:
 *                 type: string
 *                 description: The difficulty level of the course.
 *                 enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
 *                 example: "INTERMEDIATE"
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Subject IDs the course is related to (array of string).
 *                   example: ["60b8d7d7f1c4f95f1a1a1a3d", "60b8d7d7f1c4f95f1a1a1a4e"]
 *     responses:
 *       200:
 *         description: Course successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the updated course.
 *                   example: "60b8d7d7f1c4f95f1a1a1a4d"
 *                 name:
 *                   type: string
 *                   description: The updated name of the course.
 *                   example: "Advanced JavaScript"
 *                 description:
 *                   type: string
 *                   description: The updated description of the course.
 *                   example: "An advanced course to deepen your JavaScript knowledge."
 *                 active:
 *                   type: boolean
 *                   description: Whether the course is active.
 *                   example: true
 *                 level:
 *                   type: string
 *                   description: The updated difficulty level of the course.
 *                   example: "INTERMEDIATE"
 *       400:
 *         description: Bad request — Invalid course data.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/courses/delete:
 *   post:
 *     summary: Delete multiple courses
 *     description: This route is used to delete multiple courses from the system by providing an array of course IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of course IDs to be deleted.
 *                   example: ["60b8d7d7f1c4f95f1a1a1a4d", "60b8d7d7f1c4f95f1a1a1a5e"]
 *                 description: The array of course IDs to delete.
 *                 example: ["60b8d7d7f1c4f95f1a1a1a4d", "60b8d7d7f1c4f95f1a1a1a5e"]
 *     responses:
 *       200:
 *         description: Courses successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of courses that were successfully deleted.
 *                   example: 2
 *       400:
 *         description: Bad request — Invalid request data or missing course IDs.
 *       404:
 *         description: One or more courses not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/plans/list/{courseid}:
 *   get:
 *     summary: List all plans for a specific course
 *     description: This route is used to retrieve all the plans associated with a specific course identified by the `courseid`.
 *     parameters:
 *       - in: path
 *         name: courseid
 *         required: true
 *         description: The unique identifier of the course.
 *         schema:
 *           type: string
 *           example: "60b8d7d7f1c4f95f1a1a1a4d"
 *     queryParameters:
 *       - in: query
 *         name: size
 *         required: true
 *         description: The number of plans to retrieve per page.
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         description: The number of plans to skip (for pagination).
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         description: A search query to filter the plans (optional).
 *         schema:
 *           type: string
 *           example: "Basic Plan"
 *     responses:
 *       200:
 *         description: Successfully retrieved list of plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       plan_id:
 *                         type: string
 *                         description: The unique identifier of the plan.
 *                         example: "60b8d7d7f1c4f95f1a1a1a5d"
 *                       name:
 *                         type: string
 *                         description: The name of the plan.
 *                         example: "Basic Plan"
 *                       description:
 *                         type: string
 *                         description: A brief description of the plan.
 *                         example: "Access to basic features."
 *                       price:
 *                         type: number
 *                         description: The price of the plan.
 *                         example: 29.99
 *                       active:
 *                         type: boolean
 *                         description: Whether the plan is active or not.
 *                         example: true
 *       400:
 *         description: Bad request — Invalid query parameters.
 *       404:
 *         description: No plans found for the given course ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/plans/get/{id}:
 *   get:
 *     summary: Get a specific plan by ID
 *     description: This route is used to retrieve the details of a specific plan identified by the `id`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the plan.
 *         schema:
 *           type: string
 *           example: "60b8d7d7f1c4f95f1a1a1a5d"
 *     responses:
 *       200:
 *         description: Successfully retrieved plan details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan_id:
 *                   type: string
 *                   description: The unique identifier of the plan.
 *                   example: "60b8d7d7f1c4f95f1a1a1a5d"
 *                 name:
 *                   type: string
 *                   description: The name of the plan.
 *                   example: "Basic Plan"
 *                 description:
 *                   type: string
 *                   description: A brief description of the plan.
 *                   example: "Access to basic features."
 *                 price:
 *                   type: number
 *                   description: The price of the plan.
 *                   example: 29.99
 *                 active:
 *                   type: boolean
 *                   description: Whether the plan is active or not.
 *                   example: true
 *       404:
 *         description: Plan not found — Invalid plan ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/plans/add:
 *   post:
 *     summary: Add a new plan
 *     description: This route is used to add a new plan to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the plan.
 *                 example: "Premium Plan"
 *               description:
 *                 type: string
 *                 description: A brief description of the plan.
 *                 example: "Access to all premium features."
 *               price:
 *                 type: number
 *                 description: The price of the plan.
 *                 example: 49.99
 *               duration:
 *                 type: number
 *                 description: The duration of the plan in months.
 *                 example: 12
 *               active:
 *                 type: boolean
 *                 description: Whether the plan is active or not.
 *                 example: true
 *               course:
 *                 type: string
 *                 description: The ID of the course the plan is associated with.
 *                 example: "60b8d7d7f1c4f95f1a1a1a6e"
 *     responses:
 *       201:
 *         description: Plan successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan_id:
 *                   type: string
 *                   description: The unique identifier of the newly created plan.
 *                   example: "60b8d7d7f1c4f95f1a1a1a6f"
 *                 name:
 *                   type: string
 *                   description: The name of the plan.
 *                   example: "Premium Plan"
 *                 description:
 *                   type: string
 *                   description: The description of the plan.
 *                   example: "Access to all premium features."
 *                 price:
 *                   type: number
 *                   description: The price of the plan.
 *                   example: 49.99
 *                 duration:
 *                   type: number
 *                   description: The duration of the plan in months.
 *                   example: 12
 *                 active:
 *                   type: boolean
 *                   description: Whether the plan is active.
 *                   example: true
 *                 course:
 *                   type: string
 *                   description: The ID of the associated course.
 *                   example: "60b8d7d7f1c4f95f1a1a1a6e"
 *       400:
 *         description: Bad request — Invalid plan data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/plans/edit/{id}:
 *   put:
 *     summary: Edit an existing plan
 *     description: This route is used to edit an existing plan based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the plan to be edited.
 *         schema:
 *           type: string
 *           example: "60b8d7d7f1c4f95f1a1a1a6f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the plan.
 *                 example: "Premium Plan"
 *               description:
 *                 type: string
 *                 description: A brief description of the plan.
 *                 example: "Access to all premium features."
 *               price:
 *                 type: number
 *                 description: The price of the plan.
 *                 example: 49.99
 *               duration:
 *                 type: number
 *                 description: The duration of the plan in months.
 *                 example: 12
 *               active:
 *                 type: boolean
 *                 description: Whether the plan is active or not.
 *                 example: true
 *               course:
 *                 type: string
 *                 description: The ID of the course the plan is associated with.
 *                 example: "60b8d7d7f1c4f95f1a1a1a6e"
 *     responses:
 *       200:
 *         description: Plan successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan_id:
 *                   type: string
 *                   description: The unique identifier of the updated plan.
 *                   example: "60b8d7d7f1c4f95f1a1a1a6f"
 *                 name:
 *                   type: string
 *                   description: The name of the plan.
 *                   example: "Premium Plan"
 *                 description:
 *                   type: string
 *                   description: The description of the plan.
 *                   example: "Access to all premium features."
 *                 price:
 *                   type: number
 *                   description: The price of the plan.
 *                   example: 49.99
 *                 duration:
 *                   type: number
 *                   description: The duration of the plan in months.
 *                   example: 12
 *                 active:
 *                   type: boolean
 *                   description: Whether the plan is active.
 *                   example: true
 *                 course:
 *                   type: string
 *                   description: The ID of the associated course.
 *                   example: "60b8d7d7f1c4f95f1a1a1a6e"
 *       400:
 *         description: Bad request — Invalid plan data.
 *       404:
 *         description: Plan not found with the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/plans/delete:
 *   post:
 *     summary: Delete multiple plans
 *     description: This route is used to delete multiple plans by their IDs passed in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The list of plan IDs to be deleted.
 *                   example: "60b8d7d7f1c4f95f1a1a1a6f"
 *                 description: List of IDs to delete
 *     responses:
 *       200:
 *         description: Plans successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A confirmation message.
 *                   example: "Plans successfully deleted."
 *       400:
 *         description: Bad request — Invalid IDs or empty array.
 *       404:
 *         description: Plans not found for the provided IDs.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/questions/list:
 *   get:
 *     summary: List all questions
 *     description: This route is used to retrieve a list of all questions, with support for pagination and search.
 *     parameters:
 *       - name: size
 *         in: query
 *         description: The number of questions to return in the response (pagination size).
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - name: skip
 *         in: query
 *         description: The number of questions to skip (pagination offset).
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *       - name: search
 *         in: query
 *         description: A search query to filter questions by their content (optional).
 *         required: false
 *         schema:
 *           type: string
 *           example: "JavaScript"
 *     responses:
 *       200:
 *         description: A list of questions matching the search criteria and pagination settings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of questions in the database.
 *                   example: 50
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the question.
 *                         example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                       question:
 *                         type: string
 *                         description: The content of the question.
 *                         example: "What is JavaScript?"
 *                       createdAt:
 *                         type: string
 *                         description: The date and time when the question was created.
 *                         example: "2022-08-01T12:34:56.789Z"
 *       400:
 *         description: Bad request — Missing or invalid query parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/questions/get/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: This route is used to retrieve a specific question by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the question to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "60b8d7d7f1c4f95f1a1a1a9b"
 *     responses:
 *       200:
 *         description: The question was successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the question.
 *                   example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                 question:
 *                   type: string
 *                   description: The content of the question.
 *                   example: "What is JavaScript?"
 *                 createdAt:
 *                   type: string
 *                   description: The date and time when the question was created.
 *                   example: "2022-08-01T12:34:56.789Z"
 *       400:
 *         description: Bad request — Invalid or missing ID parameter.
 *       404:
 *         description: Question not found — The question with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/questions/edit/{id}:
 *   put:
 *     summary: Edit a question by ID
 *     description: This route is used to update an existing question by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the question to update.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "60b8d7d7f1c4f95f1a1a1a9b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_text:
 *                 type: string
 *                 description: The text of the question.
 *                 example: "What is the capital of France?"
 *               subject_id:
 *                 type: string
 *                 description: The subject ID associated with the question.
 *                 example: "60b8d7d7f1c4f95f1a1a1a2b"
 *               course_id:
 *                 type: string
 *                 description: The course ID associated with the question.
 *                 example: "60b8d7d7f1c4f95f1a1a1a3c"
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: The text of the option.
 *                       example: "Paris"
 *                     isCorrect:
 *                       type: boolean
 *                       description: Whether this option is the correct answer.
 *                       example: true
 *                 minItems: 1
 *                 description: A list of options for the question (at least one option required).
 *               explanation_text:
 *                 type: string
 *                 description: An optional explanation text for the correct answer.
 *                 example: "Paris is the capital of France."
 *               explanation_video:
 *                 type: string
 *                 description: A URL or path to an explanation video (optional).
 *                 example: "https://example.com/video.mp4"
 *               explanation_image:
 *                 type: string
 *                 description: A URL or path to an explanation image (optional).
 *                 example: "https://example.com/image.png"
 *               explanation_image_data:
 *                 type: string
 *                 description: Base64 encoded explanation image data (optional).
 *                 example: "data:image/png;base64, ..."
 *               image_url:
 *                 type: string
 *                 description: A URL to an image related to the question (optional).
 *                 example: "https://example.com/question_image.png"
 *               image_url_data:
 *                 type: string
 *                 description: Base64 encoded image data for the question image (optional).
 *                 example: "data:image/png;base64, ..."
 *               difficulty_level:
 *                 type: string
 *                 enum: ['EASY', 'MEDIUM', 'HARD']
 *                 description: The difficulty level of the question.
 *                 example: "EASY"
 *               is_diagnostic:
 *                 type: boolean
 *                 description: Whether the question is for diagnostic purposes.
 *                 example: true
 *               is_real_exam:
 *                 type: boolean
 *                 description: Whether the question is part of a real exam.
 *                 example: false
 *     responses:
 *       200:
 *         description: The question was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the updated question.
 *                   example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                 question_text:
 *                   type: string
 *                   description: The updated text of the question.
 *                   example: "What is the capital of France?"
 *                 subject_id:
 *                   type: string
 *                   description: The subject ID of the updated question.
 *                   example: "60b8d7d7f1c4f95f1a1a1a2b"
 *                 course_id:
 *                   type: string
 *                   description: The course ID associated with the question.
 *                   example: "60b8d7d7f1c4f95f1a1a1a3c"
 *                 options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                         description: The text of the option.
 *                         example: "Paris"
 *                       isCorrect:
 *                         type: boolean
 *                         description: Whether this option is correct.
 *                         example: true
 *                 explanation_text:
 *                   type: string
 *                   description: An optional explanation text for the correct answer.
 *                   example: "Paris is the capital of France."
 *                 image_url:
 *                   type: string
 *                   description: The URL for the question image.
 *                   example: "https://example.com/image.png"
 *       400:
 *         description: Bad request — Invalid or missing question data.
 *       404:
 *         description: Question not found — The question with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/questions/delete:
 *   post:
 *     summary: Delete multiple questions by IDs
 *     description: This route is used to delete multiple questions from the system using their unique IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The unique identifier of the question to be deleted.
 *                   example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                 description: A list of question IDs to be deleted.
 *                 example: ["60b8d7d7f1c4f95f1a1a1a9b", "60b8d7d7f1c4f95f1a1a1aa0"]
 *     responses:
 *       200:
 *         description: The questions were successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of questions deleted.
 *                   example: 2
 *       400:
 *         description: Bad request — Invalid or missing question IDs.
 *       404:
 *         description: Not found — Some or all of the questions with the provided IDs do not exist.
 *       500:
 *         description: Internal server error — An error occurred while processing the request.
 */

/**
 * @swagger
 * /admin/questions/course-questions:
 *   get:
 *     summary: Get questions for a specific course
 *     description: This route is used to retrieve questions for a particular course. You can paginate, search, and sort the questions using query parameters.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: The number of questions to retrieve per page.
 *         example: 10
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *           description: The number of questions to skip (for pagination).
 *         example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           default: ""
 *           description: A search term to filter the questions (optional).
 *         example: "JavaScript"
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           default: "id DESC"
 *           description: The sorting order of the results. You can specify the field and the direction (e.g., "id ASC" or "name DESC").
 *         example: "id DESC"
 *       - in: query
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the course for which you want to fetch the questions.
 *         example: "60b8d7d7f1c4f95f1a1a1a3c"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of questions for the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of questions for the course.
 *                   example: 25
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the question.
 *                         example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                       question_text:
 *                         type: string
 *                         description: The text of the question.
 *                         example: "What is JavaScript?"
 *                       difficulty_level:
 *                         type: string
 *                         description: The difficulty level of the question.
 *                         example: "BEGINNER"
 *                       is_diagnostic:
 *                         type: boolean
 *                         description: Whether the question is for diagnostic purposes.
 *                         example: true
 *                       is_real_exam:
 *                         type: boolean
 *                         description: Whether the question is part of a real exam.
 *                         example: false
 *       400:
 *         description: Bad request — Invalid query parameters.
 *       404:
 *         description: Not found — No questions found for the provided course ID.
 *       500:
 *         description: Internal server error — An error occurred while processing the request.
 */

/**
 * @swagger
 * /admin/contact/list:
 *   get:
 *     summary: Get the list of contact inquiries
 *     description: This route retrieves a list of contact inquiries with support for pagination and search.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           description: The number of contact inquiries to retrieve per page.
 *           example: 10
 *       - in: query
 *         name: skip
 *         required: true
 *         schema:
 *           type: integer
 *           description: The number of contact inquiries to skip (for pagination).
 *           example: 0
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           description: A search term to filter the contact inquiries.
 *           example: "John"
 *       - in: query
 *         name: sorting
 *         required: false
 *         schema:
 *           type: string
 *           description: Sorting order for the result. You can specify the field and direction (e.g., "date DESC" or "name ASC").
 *           example: "date DESC"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of contact inquiries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of contact inquiries available.
 *                   example: 50
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the contact inquiry.
 *                         example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                       name:
 *                         type: string
 *                         description: The name of the person who submitted the contact inquiry.
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: The email of the person who submitted the contact inquiry.
 *                         example: "john.doe@example.com"
 *                       message:
 *                         type: string
 *                         description: The message submitted in the contact form.
 *                         example: "I need help with my account."
 *                       date:
 *                         type: string
 *                         description: The date when the contact inquiry was created.
 *                         example: "2022-09-01T15:30:00Z"
 *       400:
 *         description: Bad request — Invalid query parameters.
 *       404:
 *         description: No contact inquiries found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/contact/get/{id}:
 *   get:
 *     summary: Get a specific contact inquiry by ID
 *     description: This route retrieves a single contact inquiry based on the provided contact ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the contact inquiry.
 *           example: "60b8d7d7f1c4f95f1a1a1a9b"
 *     responses:
 *       200:
 *         description: Successfully retrieved the contact inquiry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the contact inquiry.
 *                   example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                 name:
 *                   type: string
 *                   description: The name of the person who submitted the contact inquiry.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the person who submitted the contact inquiry.
 *                   example: "john.doe@example.com"
 *                 message:
 *                   type: string
 *                   description: The message submitted in the contact form.
 *                   example: "I need help with my account."
 *                 date:
 *                   type: string
 *                   description: The date when the contact inquiry was created.
 *                   example: "2022-09-01T15:30:00Z"
 *       400:
 *         description: Bad request — Invalid contact ID format.
 *       404:
 *         description: Contact inquiry not found for the provided ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/contact/delete:
 *   post:
 *     summary: Delete multiple contact inquiries
 *     description: This route allows the deletion of multiple contact inquiries based on the provided array of IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The unique identifiers of the contact inquiries to be deleted.
 *                   example: "60b8d7d7f1c4f95f1a1a1a9b"
 *                 description: List of contact inquiry IDs to be deleted.
 *                 example: ["60b8d7d7f1c4f95f1a1a1a9b", "60b8d7d7f1c4f95f1a1a1a9c"]
 *     responses:
 *       200:
 *         description: Successfully deleted the specified contact inquiries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of deleted contact inquiries.
 *                   example: 2
 *       400:
 *         description: Bad request — Invalid contact inquiry IDs format.
 *       404:
 *         description: Some or all contact inquiries not found.
 *       500:
 *         description: Internal server error.
 */
