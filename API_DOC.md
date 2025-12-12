# DIY Gadgets API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [User Authentication](#user-authentication)
- [Admin Authentication](#admin-authentication)
- [User Management](#user-management)
- [User Addresses](#user-addresses)
- [Products](#products)
- [Categories](#categories)
- [Cart](#cart)
- [Orders](#orders)
- [Admin Orders](#admin-orders)
- [Inventory](#inventory)
- [Shipping Methods](#shipping-methods)
- [Notification Logs](#notification-logs)
- [Refresh Token](#refresh-token)

---

## Base URL

```
Development: https://diy-gadgets-api-development.{account}.workers.dev
Production: https://diy-gadgets-api-production.{account}.workers.dev
```

All API endpoints are prefixed with `/api/v1`

---

## Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Token) for authentication. There are two types of users:
- **Customer** (`identity: "customer"`) - Regular users
- **Admin** (`identity: "system"`) - Admin users

### How to Authenticate

1. **Login** to get access token and refresh token
2. Include the access token in the `Authorization` header for protected endpoints:
   ```
   Authorization: Bearer <access_token>
   ```
3. Include refresh token in `x-refresh-token` header when refreshing tokens:
   ```
   x-refresh-token: <refresh_token>
   ```

### Token Expiration

- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days

### Token Refresh

When access token expires, use the refresh token endpoint to get a new access token and refresh token.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Optional success message",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message or array of validation errors"
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `405` - Token expired (with refresh key)
- `500` - Internal Server Error

---

## User Authentication

### Register User

**POST** `/api/v1/user/auth/register`

**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "01712345678",
  "email": "john@example.com", // Optional
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "phone": "01712345678",
      "email": "john@example.com",
      "isEmailVerified": false,
      "isPhoneVerified": false
    },
    "message": "Please check your email to verify your account"
  }
}
```

**Validation Rules:**
- `fullName`: 1-30 characters
- `phone`: Must be valid Bangladeshi phone number (01[1-9]XXXXXXXX)
- `email`: Valid email format (optional)
- `password`: Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character

---

### Login

**POST** `/api/v1/user/auth/login`

**Body:**
```json
{
  "login": "john@example.com", // or phone number
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "random64characterstring",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "phone": "01712345678",
      "email": "john@example.com"
    }
  }
}
```

---

### Verify Email

**GET** `/api/v1/user/auth/verify-email?token=<verification_token>`

**Query Parameters:**
- `token` (required) - Email verification token

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

---

### Request Password Reset

**POST** `/api/v1/user/auth/request-password-reset`

**Body:**
```json
{
  "identifier": "john@example.com", // or phone number
  "method": "email" // Optional: "email" or "phone" (auto-detected if not provided)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reset code sent to your email",
    "method": "email",
    "identifier": "jo***@example.com"
  }
}
```

---

### Reset Password

**POST** `/api/v1/user/auth/reset-password`

**Body:**
```json
{
  "identifier": "john@example.com",
  "otp": "123456",
  "password": "NewSecurePass123!",
  "password_confirmation": "NewSecurePass123!",
  "method": "email" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully. Please login with your new password.",
    "method": "email"
  }
}
```

---

### Resend Reset OTP

**POST** `/api/v1/user/auth/resend-reset-otp`

**Body:**
```json
{
  "identifier": "john@example.com",
  "method": "email" // Optional
}
```

---

### Logout

**POST** `/api/v1/user/auth/logout`

**Headers:**
- `Authorization: Bearer <access_token>`
- `x-refresh-token: <refresh_token>` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### Logout All Devices

**POST** `/api/v1/user/auth/logout-all`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out from all devices successfully"
  }
}
```

---

## Admin Authentication

### Admin Login

**POST** `/api/v1/admin/auth/login`

**Body:**
```json
{
  "username": "admin@example.com", // or phone number
  "password": "AdminPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "user": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@example.com",
      "phone": "01712345678"
    },
    "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "random64characterstring"
  }
}
```

---

### Change Admin Password

**PATCH** `/api/v1/admin/auth/change-password`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "username": "admin@example.com",
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully. Please login again."
  }
}
```

---

### Generate Admin Password

**POST** `/api/v1/admin/auth/generate-password`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "username": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password generated successfully. Please login with the new password.",
    "data": {
      "password": "GeneratedRandomPassword123!"
    }
  }
}
```

---

### Admin Logout

**POST** `/api/v1/admin/auth/logout`

**Headers:**
- `Authorization: Bearer <access_token>`
- `x-refresh-token: <refresh_token>` (optional)

---

### Admin Logout All

**POST** `/api/v1/admin/auth/logout-all`

**Headers:**
- `Authorization: Bearer <access_token>`

---

## User Management

### Get Current User Profile

**GET** `/api/v1/user/profile`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "phone": "01712345678",
    "email": "john@example.com",
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "isActive": true,
    "gender": "male",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update User Profile

**PUT** `/api/v1/user/profile`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "fullName": "John Updated",
  "phone": "01712345678",
  "email": "newemail@example.com",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Updated",
    "phone": "01712345678",
    "email": "newemail@example.com",
    "isEmailVerified": false,
    "message": "Profile updated successfully"
  }
}
```

---

### Resend Verification Email

**POST** `/api/v1/user/resend-verification-email`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent successfully",
    "verificationLink": "https://api.example.com/api/v1/user/auth/verify-email?token=..."
  }
}
```

---

### Request Phone Verification

**POST** `/api/v1/user/request-phone-verification`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "phone": "01712345678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Verification code sent to your phone",
    "phone": "0171***678"
  }
}
```

---

### Verify Phone

**POST** `/api/v1/user/verify-phone`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "phone": "01712345678",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Phone number verified successfully"
  }
}
```

---

### Change Password

**POST** `/api/v1/user/change-password`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "newPassword_confirmation": "NewPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully. Please login again."
  }
}
```

---

### Get All Users (Admin Only)

**GET** `/api/v1/user`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `search` - Search by name, email, or phone
- `isEmailVerified` - Filter by email verification status (true/false)
- `isPhoneVerified` - Filter by phone verification status (true/false)
- `isActive` - Filter by active status (true/false)
- `gender` - Filter by gender (male/female)
- `ageMin` - Minimum age
- `ageMax` - Maximum age
- `sortBy` - Sort field (default: "createdAt")
- `sortOrder` - Sort order (asc/desc, default: "desc")
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### Create User (Admin Only)

**POST** `/api/v1/user`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "fullName": "New User",
  "phone": "01712345678",
  "email": "newuser@example.com",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "password": "GeneratedPassword123!",
    "message": "User created successfully"
  }
}
```

---

### Update User (Admin Only)

**PUT** `/api/v1/user/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:** (Same as update profile)

---

## User Addresses

All address endpoints require authentication.

### Get All Addresses

**GET** `/api/v1/addresses`

**Headers:**
- `Authorization: Bearer <access_token>`

**Query Parameters:**
- `addressType` - Filter by type (shipping/billing/both)
- `isDefault` - Filter by default status (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": 1,
        "addressType": "shipping",
        "streetAddress": "123 Main St",
        "city": "Dhaka",
        "state": "Dhaka",
        "postalCode": "1200",
        "country": "Bangladesh",
        "isDefault": true
      }
    ],
    "count": 1
  }
}
```

---

### Create Address

**POST** `/api/v1/addresses`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "addressType": "shipping", // "shipping", "billing", or "both"
  "streetAddress": "123 Main Street",
  "city": "Dhaka",
  "state": "Dhaka", // Must be one of: Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh
  "postalCode": "1200", // 4 digits
  "country": "Bangladesh",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": {...},
    "message": "Address created successfully"
  }
}
```

---

### Get Default Address

**GET** `/api/v1/addresses/default`

**Headers:**
- `Authorization: Bearer <access_token>`

---

### Get Address by ID

**GET** `/api/v1/addresses/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

---

### Update Address

**PUT** `/api/v1/addresses/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:** (Same fields as create, all optional)

---

### Delete Address

**DELETE** `/api/v1/addresses/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

**Note:** Cannot delete address if it's used in any orders.

---

### Set Default Address

**PUT** `/api/v1/addresses/:id/set-default`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "isDefault": true
}
```

---

## Products

### Get All Products

**GET** `/api/v1/product`

**Query Parameters:**
- `search` - Search in name, description, or brand
- `isActive` - Filter by active status (true/false)
- `categoryId` - Filter by category (includes subcategories)
- `brand` - Filter by brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `attributes` - Filter by variant attributes (format: "type:value,type:value", e.g., "color:Red,size:Large")
- `sortBy` - Sort field (name, createdAt, updatedAt, default: "createdAt")
- `sortOrder` - Sort order (asc/desc, default: "desc")
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description",
        "brand": "Brand Name",
        "category": {...},
        "variants": [
          {
            "id": 1,
            "sku": "SKU-001",
            "basePrice": 1000,
            "salePrice": 800,
            "attributes": [
              {
                "attributeType": "color",
                "attributeValue": "Red"
              }
            ],
            "inventory": {
              "quantityAvailable": 50,
              "quantityReserved": 5
            },
            "images": [...]
          }
        ]
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### Get Product by ID or Slug

**GET** `/api/v1/product/:identifier`

**Response:** Same structure as product in list, with full details.

---

### Create Product (Admin Only)

**POST** `/api/v1/product`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "categoryId": 1,
  "name": "Product Name",
  "description": "Product description",
  "brand": "Brand Name",
  "skuPrefix": "PRD",
  "specifications": "Product specifications",
  "isActive": true,
  "variants": [
    {
      "sku": "PRD-001",
      "basePrice": 1000,
      "salePrice": 800,
      "isActive": true,
      "weight": 1.5,
      "length": 10,
      "width": 5,
      "height": 3,
      "attributes": [
        {
          "attributeType": "color",
          "attributeValue": "Red"
        }
      ]
    }
  ]
}
```

---

### Update Product (Admin Only)

**PUT** `/api/v1/product/:productId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:** (Same as create)

---

### Delete Product (Admin Only)

**DELETE** `/api/v1/product/:productId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note:** Soft delete - sets `isDeleted: true` and `isActive: false`

---

### Create/Update Inventory (Admin Only)

**POST** `/api/v1/product/:productId/variants/:variantId/inventory`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "quantityAvailable": 100,
  "quantityReserved": 0,
  "reorderPoint": 10,
  "lastRestockDate": "2024-01-01T00:00:00.000Z" // Optional
}
```

---

### Upload Product Images (Admin Only)

**POST** `/api/v1/product/:productId/variants/:variantId/images`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)
- `Content-Type: multipart/form-data`

**Form Data:**
- `files` - Array of image files
- `metadata` - Array of JSON strings with image metadata:
  ```json
  {
    "isPrimary": true,
    "sortOrder": 0
  }
  ```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Images uploaded successfully",
    "images": [
      {
        "id": 1,
        "imageUrl": "https://assets.diygadgetsbd.com/products/...",
        "altText": "product-name-sku",
        "isPrimary": true,
        "sortOrder": 0
      }
    ]
  }
}
```

---

### Update Primary Image (Admin Only)

**PUT** `/api/v1/product/:productId/variants/:variantId/images/:imageId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

---

### Delete Product Image (Admin Only)

**DELETE** `/api/v1/product/:productId/variants/:variantId/images/:imageId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note:** Cannot delete primary image.

---

## Categories

### Get All Categories

**GET** `/api/v1/category`

**Query Parameters:**
- `search` - Search in name or description
- `isActive` - Filter by active status (true/false)
- `parent` - Filter by parent category ID (use "null" for root categories)
- `sortBy` - Sort field (default: "sortOrder")
- `sortOrder` - Sort order (asc/desc, default: "asc")
- `page` - Page number (optional)
- `limit` - Items per page (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Category Name",
        "slug": "category-name",
        "description": "Category description",
        "level": 0,
        "path": "/category-name",
        "isActive": true,
        "parent": null,
        "children": [...],
        "_count": {
          "products": 10
        }
      }
    ],
    "total": 50
  }
}
```

---

### Get Category by ID

**GET** `/api/v1/category/:id`

**Response:** Full category details with parent, children, and products.

---

### Create Category (Admin Only)

**POST** `/api/v1/category`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "Category Name",
  "parentId": null, // or parent category ID
  "description": "Category description",
  "isActive": true,
  "sortOrder": 0
}
```

---

### Update Category (Admin Only)

**PUT** `/api/v1/category/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:** (Same as create)

---

### Delete Category (Admin Only)

**DELETE** `/api/v1/category/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note:** Cannot delete category with children or products.

---

### Move Category (Admin Only)

**PATCH** `/api/v1/category/:id/move`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "newParentId": 2 // or "null" to move to root
}
```

---

## Cart

All cart endpoints require authentication.

### Get Cart Items

**GET** `/api/v1/cart`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Cart items retrieved successfully",
    "items": [
      {
        "id": 1,
        "variantId": 1,
        "quantity": 2,
        "name": "Product Name",
        "price": 1000,
        "salePrice": 800,
        "image": "https://assets.diygadgetsbd.com/...",
        "sku": "SKU-001",
        "brand": "Brand Name",
        "availableQuantity": 50
      }
    ],
    "totalItems": 2,
    "totalPrice": 1600
  }
}
```

---

### Add to Cart

**POST** `/api/v1/cart`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "variantId": 1,
  "quantity": 2
}
```

**Validation:**
- `variantId`: Positive integer
- `quantity`: 1-100

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item added to cart successfully",
    "item": {...}
  }
}
```

**Note:** If item already exists in cart, quantity is updated.

---

### Update Cart Item

**PUT** `/api/v1/cart/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "quantity": 3
}
```

---

### Remove Cart Item

**DELETE** `/api/v1/cart/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

---

### Clear Cart

**DELETE** `/api/v1/cart`

**Headers:**
- `Authorization: Bearer <access_token>`

---

## Orders

All order endpoints require authentication.

### Create Order

**POST** `/api/v1/orders`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "addressId": 1,
  "paymentMethod": "cod", // "cod", "bkash", "nagad", "rocket", "card"
  "notes": "Delivery instructions" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-0001",
      "status": "pending",
      "subtotal": 1600,
      "tax": 240,
      "shippingCost": 100,
      "total": 1940,
      "paymentMethod": "cod",
      "paymentStatus": "pending",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "address": {...},
      "items": [...]
    },
    "payment": {
      "id": 1,
      "method": "cod",
      "amount": 1940,
      "currency": "BDT",
      "status": "pending"
    }
  }
}
```

**Note:** Cart is automatically cleared after order creation.

---

### Get User Orders

**GET** `/api/v1/orders`

**Headers:**
- `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by order status (pending, paid, processing, shipped, delivered, cancelled, refunded)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### Get Order by ID

**GET** `/api/v1/orders/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-0001",
      "status": "pending",
      "subtotal": 1600,
      "tax": 240,
      "shippingCost": 100,
      "discount": 0,
      "total": 1940,
      "paymentMethod": "cod",
      "paymentStatus": "pending",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "deliveryDate": null,
      "deliveryNotes": null,
      "address": {...},
      "items": [...],
      "statusHistory": [...],
      "payment": {...}
    }
  }
}
```

---

### Cancel Order

**POST** `/api/v1/orders/:id/cancel`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Order cancelled successfully",
    "orderId": 1
  }
}
```

**Note:** Can only cancel orders with status "pending" or "paid".

---

## Admin Orders

All admin order endpoints require admin authentication.

### Get All Orders (Admin)

**GET** `/api/v1/admin/orders`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by order status
- `paymentStatus` - Filter by payment status (pending, paid, failed, cancelled)
- `paymentMethod` - Filter by payment method
- `userId` - Filter by user ID
- `startDate` - Start date filter
- `endDate` - End date filter
- `search` - Search by order ID or user email

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

### Get Order by ID (Admin)

**GET** `/api/v1/admin/orders/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Full order details with user information.

---

### Update Order (Admin)

**PUT** `/api/v1/admin/orders/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "deliveryDate": "2024-01-15T00:00:00.000Z", // Optional
  "deliveryNotes": "Delivery notes", // Optional
  "codAmount": 1940, // Optional
  "codCollected": false // Optional
}
```

---

### Update Order Status (Admin)

**PUT** `/api/v1/admin/orders/:id/status`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "statusId": 2, // New status ID
  "notes": "Status change notes" // Optional
}
```

**Valid Status Transitions:**
- `pending` → `paid`, `cancelled`
- `paid` → `processing`, `cancelled`
- `processing` → `shipped`, `cancelled`
- `shipped` → `delivered`
- `delivered` → `refunded`
- `cancelled` → (no transitions)
- `refunded` → (no transitions)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Order status updated successfully",
    "orderId": 1,
    "oldStatus": "pending",
    "newStatus": "paid"
  }
}
```

---

### Get Order Status History (Admin)

**GET** `/api/v1/admin/orders/:id/history`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 1,
        "status": "pending",
        "notes": "Order created",
        "changedBy": "user:1",
        "ipAddress": "127.0.0.1",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Order Statistics (Admin)

**GET** `/api/v1/admin/orders/stats`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `startDate` - Start date for statistics
- `endDate` - End date for statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "statusStats": [
      {
        "status": "pending",
        "count": 10
      }
    ],
    "paymentMethodStats": [
      {
        "method": "cod",
        "count": 50
      }
    ],
    "totalOrders": 100,
    "totalRevenue": 50000,
    "recentOrders": 20
  }
}
```

---

## Inventory

### Get Inventory by Variant ID

**GET** `/api/v1/inventory/:variantId`

**Response:**
```json
{
  "success": true,
  "data": {
    "inventory": {
      "id": 1,
      "variantId": 1,
      "product": {...},
      "quantityAvailable": 100,
      "quantityReserved": 5,
      "availableForSale": 95,
      "isLowStock": false,
      "reorderPoint": 10,
      "lastRestockDate": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Get Low Stock Items (Admin Only)

**GET** `/api/v1/inventory/admin/low-stock`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `limit` - Maximum items to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "lowStockItems": [...],
    "count": 5,
    "alert": "5 items are below reorder point"
  }
}
```

---

### Adjust Inventory (Admin Only)

**POST** `/api/v1/inventory/admin/adjust`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "variantId": 1,
  "quantity": 10, // Positive to add, negative to subtract
  "notes": "Restocked from supplier", // Optional
  "reason": "restock" // Optional: "manual_adjustment", "restock", "damage", "return"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Inventory increased by 10",
    "inventory": {
      "id": 1,
      "variantId": 1,
      "oldQuantity": 100,
      "adjustment": 10,
      "newQuantity": 110,
      "availableForSale": 105,
      "isLowStock": false,
      "reason": "restock",
      "notes": "Restocked from supplier"
    }
  }
}
```

---

## Shipping Methods

### Get All Shipping Methods

**GET** `/api/v1/shipping-methods`

**Query Parameters:**
- `isActive` - Filter by active status (true/false)
- `city` - Filter by available cities

**Response:**
```json
{
  "success": true,
  "data": {
    "shippingMethods": [
      {
        "id": 1,
        "name": "Standard Delivery",
        "description": "3-5 business days",
        "baseCost": 100,
        "costPerKg": 20,
        "estimatedDays": "3-5",
        "isActive": true,
        "availableInCities": "[\"Dhaka\", \"Chittagong\"]",
        "sortOrder": 0
      }
    ],
    "total": 3
  }
}
```

---

### Get Shipping Method by ID

**GET** `/api/v1/shipping-methods/:id`

---

### Calculate Shipping Cost

**POST** `/api/v1/shipping-methods/calculate-cost`

**Body:**
```json
{
  "shippingMethodId": 1,
  "totalWeight": 2.5 // in kg
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shippingMethod": {
      "id": 1,
      "name": "Standard Delivery",
      "estimatedDays": "3-5"
    },
    "cost": {
      "baseCost": 100,
      "costPerKg": 20,
      "totalWeight": 2.5,
      "totalCost": 150
    }
  }
}
```

---

### Create Shipping Method (Admin Only)

**POST** `/api/v1/shipping-methods`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "Express Delivery",
  "description": "1-2 business days",
  "baseCost": 200,
  "costPerKg": 30,
  "estimatedDays": "1-2",
  "isActive": true,
  "availableInCities": "[\"Dhaka\"]", // JSON string array
  "sortOrder": 1
}
```

---

### Update Shipping Method (Admin Only)

**PUT** `/api/v1/shipping-methods/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:** (Same as create)

---

### Delete Shipping Method (Admin Only)

**DELETE** `/api/v1/shipping-methods/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note:** Cannot delete if used in orders. Deactivate instead.

---

## Notification Logs

All notification log endpoints require admin authentication.

### Get All Notification Logs (Admin Only)

**GET** `/api/v1/notification-logs`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `userId` - Filter by user ID
- `type` - Filter by type (email/sms)
- `template` - Filter by template name
- `status` - Filter by status (sent/failed/pending)
- `startDate` - Start date filter
- `endDate` - End date filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "userId": 1,
        "type": "email",
        "template": "order_confirmation",
        "recipient": "user@example.com",
        "subject": "Order Confirmation",
        "status": "sent",
        "errorMessage": null,
        "metadata": "{\"orderId\": 1}",
        "sentAt": "2024-01-01T00:00:00.000Z",
        "user": {...}
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

### Get Notification Log by ID (Admin Only)

**GET** `/api/v1/notification-logs/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

---

### Create Notification Log (Admin Only)

**POST** `/api/v1/notification-logs`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "userId": 1, // Optional
  "type": "email", // "email" or "sms"
  "template": "order_confirmation",
  "recipient": "user@example.com",
  "subject": "Order Confirmation", // Optional
  "status": "pending", // "sent", "failed", "pending"
  "errorMessage": null, // Optional
  "metadata": "{\"orderId\": 1}", // Optional JSON string
  "sentAt": "2024-01-01T00:00:00.000Z" // Optional
}
```

---

### Update Notification Log (Admin Only)

**PUT** `/api/v1/notification-logs/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:** (Same fields as create, all optional)

---

### Delete Notification Log (Admin Only)

**DELETE** `/api/v1/notification-logs/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

---

### Get Notification Statistics (Admin Only)

**GET** `/api/v1/notification-logs/stats/summary`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `startDate` - Start date for statistics
- `endDate` - End date for statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "byType": {
        "email": 100,
        "sms": 50
      },
      "byStatus": {
        "sent": 120,
        "failed": 10,
        "pending": 20,
        "total": 150
      },
      "byTemplate": [
        {
          "template": "order_confirmation",
          "count": 50
        }
      ]
    }
  }
}
```

---

### Get User Notification Logs (Admin Only)

**GET** `/api/v1/notification-logs/user/:userId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Last 50 notifications for the user.

---

## Refresh Token

### Refresh Access Token

**POST** `/api/v1/refresh-token`

**Headers:**
- `Authorization: Bearer <expired_access_token>`
- `x-refresh-token: <refresh_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

**Note:** 
- Old refresh token is revoked
- New access token and refresh token are issued
- Access token can be expired (will be decoded without verification)

---

## Admin User Management

### Get All Admin Users (Admin Only)

**GET** `/api/v1/admin`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `search` - Search by name, email, or phone
- `isActive` - Filter by active status (true/false)
- `sortBy` - Sort field (default: "createdAt")
- `sortOrder` - Sort order (asc/desc, default: "desc")
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

### Create Admin User (Admin Only)

**POST** `/api/v1/admin`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "fullName": "Admin User",
  "phone": "01712345678",
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Admin User",
    "phone": "01712345678",
    "email": "admin@example.com",
    "isActive": true
  }
}
```

**Note:** Password is auto-generated and should be shared securely.

---

### Get Admin User by ID (Admin Only)

**GET** `/api/v1/admin/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Admin User",
    "phone": "01712345678",
    "email": "admin@example.com",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Admin User (Admin Only)

**PUT** `/api/v1/admin/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "fullName": "Updated Name",
  "phone": "01712345678",
  "email": "newemail@example.com",
  "isActive": true
}
```

---

### Delete Admin User (Admin Only)

**DELETE** `/api/v1/admin/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note:** 
- Soft delete (sets `isActive: false`)
- Cannot delete your own account

---

## Notes

### Phone Number Format
All phone numbers must be in Bangladeshi format: `01[1-9]XXXXXXXX` (11 digits starting with 01)

### Bangladesh Divisions
Valid state values for addresses:
- Dhaka
- Chittagong
- Rajshahi
- Khulna
- Barisal
- Sylhet
- Rangpur
- Mymensingh

### Postal Code Format
Bangladesh postal codes are 4 digits (e.g., "1200")

### Payment Methods
Supported payment methods:
- `cod` - Cash on Delivery
- `bkash` - bKash mobile banking
- `nagad` - Nagad mobile banking
- `rocket` - Rocket mobile banking
- `card` - Credit/Debit card

### Order Status Flow
1. `pending` - Order created, awaiting payment
2. `paid` - Payment received
3. `processing` - Order being prepared
4. `shipped` - Order shipped
5. `delivered` - Order delivered
6. `cancelled` - Order cancelled
7. `refunded` - Order refunded

### Image Upload
- Images are uploaded to Cloudflare R2 storage
- Image URLs are returned in the format: `{ASSETS_URL}/products/{productSlug}-{sku}/{filename}`
- Primary image can be set, only one primary image per variant
- Cannot delete primary image

### Inventory Management
- `quantityAvailable` - Total stock available
- `quantityReserved` - Stock reserved for pending orders
- `availableForSale` = `quantityAvailable` - `quantityReserved`
- `reorderPoint` - Minimum stock level before reorder alert

---

## Support

For API support or questions, please contact the development team.

**Last Updated:** 2024-01-01

