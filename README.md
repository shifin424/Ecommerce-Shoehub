
# ShoeHub  E-Commerce Platform

ShoeHub is a robust e-commerce platform developed using MongoDB, Node.js, Express, Bootstrap, and EJS. This project caters to both users and administrators, offering a seamless and user-friendly online shopping experience.

## User Features
- **Browse and Shop**:  Users can explore a wide range of shoes, add them to their cart, and create a wishlist for future purchases.
- **Secure Payments**:  We've integrated Razorpay for secure and hassle-free payment processing, ensuring a safe transaction experience.
- **User Profile**:  Users can track their orders, apply coupon codes for discounts, and enjoy a wallet option for convenient payments.
- **Refund Process**:  We've streamlined the refund process to provide a customer-centric approach to online shopping, making it easy for users to request and receive refunds.

## Admin Dashboard

- **Comprehensive Management**:  Admins have access to a comprehensive dashboard for efficient management of products, coupons, and user data.
- **User Control**:  Admins can block/unblock users as needed, ensuring smooth and effective management of the e-commerce platform.




## API Reference

### User Routes

#### Get Home

```http
 GET /api/
```
#### User Login

```http
GET /api/login
```

#### Post Login

```http
POST /api/postlogin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` |**Required** User's username |
| `password`      | `string` | **Required** User's password |

#### View Profile

```http
GET /api/profile
```

#### Edit Profile

```http
GET /api/editProfile
```

#### Change Profile Password

```http
GET /api/chagProfilePassword
```

#### Post Edit Profile

```http
POST /api/postEditProfile
```
#### Post Edit Profile

```http
POST /api/postEditProfile
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `profileData`      | `string` |Required. User's profile data |

#### Post Profile Change Password

```http
POST /api/profileChangePass
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `password`      | `string` |Required. New password |

#### Signup
```http
GET /api/Signup
```

#### Get OTP Page
```http
GET /api/otp
```
#### Post OTP
```http
POST /api/otp
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `otp`      | `string` |Required. OTP code |

#### Post Signup
```http
POST /api/postSignup
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userData`      | `object` |RRequired. User's data |

#### View Cart
```http
GET /api/viewcart
```

#### Add To Cart
```http
GET /api/cart
```
#### Add To Cart
```http
POST /api/cart
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `productId`      | `string` |Required. Product ID |
| `quantity`      | `number` |Required. Quantity |

### Admin Routes

#### Admin Login
```http
GET /api/admin
```
#### Post Admin Login
```http
POST /api/admin/signin
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` |Required. Admin's username |
| `password`      | `string` |Required. Admin's password |

#### Get Admin Dashboard
```http
GET /api/admin/dashBoard
```

#### Sales Report
```http
GET /api/admin/salesReport
```


## Conclusion

ShoeHub is your go-to destination for a diverse selection of shoes and a hassle-free shopping experience. Whether you're a user looking for the latest footwear or an admin managing the platform, ShoeHub has you covered.

