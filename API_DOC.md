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
- [Product Search & Filtering](#product-search--filtering)
- [Categories](#categories)
- [Cart](#cart)
- [Wishlist](#wishlist)
- [Orders](#orders)
- [Preorders](#preorders)
- [Admin Orders](#admin-orders)
- [Payment Management](#payment-management)
- [Inventory](#inventory)
- [Shipping Methods](#shipping-methods)
- [Role & Permission Management](#role--permission-management)
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
- `search` - Full-text search in name, description, brand, and specifications
- `isActive` - Filter by active status (true/false)
- `categoryId` - Filter by category (includes subcategories)
- `brand` - Filter by brand (case-insensitive)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `attributes` - Filter by variant attributes (format: "type:value,type:value", e.g., "color:Red,size:Large")
- `sortBy` - Sort field (name, price, createdAt, updatedAt, relevance, default: "createdAt")
- `sortOrder` - Sort order (asc/desc, default: "desc")
- `relevanceSort` - Sort by relevance when search query provided (true/false, default: false)
- `includeFacets` - Include faceted search data (true/false, default: false)
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

### Search Suggestions (Autocomplete)

**GET** `/api/v1/product/search/suggestions`

**Query Parameters:**
- `q` - Search query (minimum 2 characters, required)
- `limit` - Maximum suggestions (default: 10, max: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": 1,
        "name": "Gaming Laptop",
        "slug": "gaming-laptop",
        "brand": "ASUS",
        "category": "Laptops",
        "price": 85000,
        "image": "https://assets.../image.jpg",
        "type": "product"
      },
      {
        "name": "Laptop",
        "type": "brand"
      }
    ],
    "query": "lap",
    "count": 8
  }
}
```

**Use Case**: Real-time autocomplete for search input

---

### Get Available Facets/Filters

**GET** `/api/v1/product/facets`

**Query Parameters:**
- `categoryId` - Filter by category (optional)
- `search` - Search query (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "facets": {
      "brands": ["ASUS", "HP", "Dell"],
      "priceRange": {
        "min": 30000,
        "max": 150000
      },
      "attributes": {
        "color": ["Black", "Silver"],
        "screen_size": ["15.6 inch", "17.3 inch"]
      },
      "categories": [
        { "id": 5, "name": "Laptops", "count": 45 }
      ]
    },
    "appliedFilters": {
      "categoryId": 5,
      "search": "laptop"
    }
  }
}
```

**Use Case**: Get available filters to show users for refining search

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

## Product Search & Filtering

### Advanced Search Features

The product search endpoint supports:
- ✅ **Full-text search** across name, description, brand, and specifications
- ✅ **Relevance ranking** - Products sorted by match quality
- ✅ **Faceted search** - Available filters based on results
- ✅ **Autocomplete** - Real-time search suggestions

### Search with Relevance Ranking

When using `relevanceSort=true` with a search query, products are sorted by relevance score:

**Relevance Scoring**:
- Exact name match: 1000 points
- Name starts with query: 500 points
- Name contains query: 300 points
- Word-by-word matching: 50 points per word
- Brand match: 100-200 points
- Description match: 10-30 points
- Specifications match: 5-20 points
- Active product bonus: 10 points
- In-stock bonus: 20 points

**Example**:
```
GET /api/v1/product?search=gaming%20laptop&relevanceSort=true&includeFacets=true
```

**Response includes**:
- `_relevanceScore` - Relevance score for each product
- `_matchDetails` - Details about what matched
- `facets` - Available filters (brands, prices, attributes, categories)

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

## Wishlist

All wishlist endpoints require authentication.

### Get Wishlist

**GET** `/api/v1/wishlist`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Wishlist retrieved successfully",
    "items": [
      {
        "id": 1,
        "variantId": 5,
        "productId": 2,
        "productName": "Gaming Laptop",
        "productSlug": "gaming-laptop",
        "brand": "ASUS",
        "category": {
          "id": 1,
          "name": "Laptops",
          "slug": "laptops"
        },
        "sku": "LAP-001",
        "price": 85000,
        "salePrice": 80000,
        "image": "https://assets.diygadgetsbd.com/products/...",
        "attributes": [
          {
            "type": "color",
            "value": "Black"
          },
          {
            "type": "ram",
            "value": "16GB"
          }
        ],
        "availableQuantity": 10,
        "isInStock": true,
        "addedAt": "2025-12-15T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### Add to Wishlist

**POST** `/api/v1/wishlist`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "variantId": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item added to wishlist successfully",
    "item": {
      "id": 1,
      "variantId": 5,
      "productName": "Gaming Laptop",
      "productSlug": "gaming-laptop",
      "brand": "ASUS",
      "sku": "LAP-001",
      "price": 80000,
      "image": "https://assets.diygadgetsbd.com/products/...",
      "addedAt": "2025-12-15T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Item already in wishlist
- `404` - Product variant not found or inactive

---

### Remove from Wishlist

**DELETE** `/api/v1/wishlist/:id`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item removed from wishlist successfully"
  }
}
```

**Error Responses:**
- `404` - Wishlist item not found

---

### Add Wishlist Item to Cart

**POST** `/api/v1/wishlist/:id/add-to-cart`

**Headers:**
- `Authorization: Bearer <access_token>`

**Body:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item added to cart successfully",
    "variantId": 5,
    "quantity": 2
  }
}
```

**Error Responses:**
- `400` - Insufficient stock
- `404` - Wishlist item not found

**Note:** If the item already exists in cart, the quantity will be updated.

---

### Check if Variant is in Wishlist

**GET** `/api/v1/wishlist/check/:variantId`

**Headers:**
- `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "isInWishlist": true,
    "wishlistItemId": 1
  }
}
```

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
      "courierName": null,
      "courierTrackingNumber": null,
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

**Note:** 
- Cart is automatically cleared after order creation
- For COD orders, add courier information (`courierName`, `courierTrackingNumber`) when order is sent to courier
- When order status is updated to "delivered", payment is automatically marked as "paid"

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
      "courierName": "SteadFast",
      "courierTrackingNumber": "SF123456789",
      "address": {...},
      "items": [...],
      "statusHistory": [...],
      "payment": {...}
    }
  }
}
```

**Note**: 
- `courierName` and `courierTrackingNumber` are added when order is sent to courier service
- For COD orders, when status is updated to "delivered", payment is automatically marked as "paid"

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

**Note on Preorders:**
- When creating an order, if any cart items have active preorders, the system automatically:
  - Uses preorder price instead of regular price
  - Marks order items as `isPreorder: true`
  - Increments preorder count
  - Does NOT reserve inventory (preorders don't have stock yet)
- Preorder items are included in order totals calculation

---

## Preorders

Preorder endpoints allow customers to preorder products that are not yet in stock.

### Get Available Preorders

**GET** `/api/v1/preorders`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `isActive` - Filter by active status (true/false, default: true)
- `variantId` - Filter by variant ID
- `availableOnly` - Show only preorders with available slots (true/false, default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "preorders": [
      {
        "id": 1,
        "variantId": 5,
        "product": {
          "id": 2,
          "name": "Gaming Laptop",
          "slug": "gaming-laptop",
          "brand": "ASUS",
          "category": {
            "id": 1,
            "name": "Laptops",
            "slug": "laptops"
          }
        },
        "variant": {
          "id": 5,
          "sku": "LAP-001",
          "attributes": [
            {
              "type": "color",
              "value": "Black"
            }
          ],
          "image": "https://assets.diygadgetsbd.com/products/..."
        },
        "expectedArrivalDate": "2026-01-15T00:00:00.000Z",
        "maximumQuantity": 100,
        "currentPreorders": 25,
        "availableSlots": 75,
        "isAvailable": true,
        "preorderPrice": 75000,
        "isActive": true,
        "createdAt": "2025-12-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### Get Preorder by ID

**GET** `/api/v1/preorders/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "preorder": {
      "id": 1,
      "variantId": 5,
      "product": {...},
      "variant": {...},
      "expectedArrivalDate": "2026-01-15T00:00:00.000Z",
      "maximumQuantity": 100,
      "currentPreorders": 25,
      "availableSlots": 75,
      "isAvailable": true,
      "preorderPrice": 75000,
      "isActive": true,
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-15T10:00:00.000Z"
    }
  }
}
```

---

### Admin: Get All Preorders

**GET** `/api/v1/admin/preorders`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `isActive` - Filter by active status (true/false)
- `variantId` - Filter by variant ID

**Response:**
```json
{
  "success": true,
  "data": {
    "preorders": [...],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### Admin: Create Preorder

**POST** `/api/v1/admin/preorders`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "variantId": 5,
  "expectedArrivalDate": "2026-01-15T00:00:00.000Z",
  "maximumQuantity": 100,
  "preorderPrice": 75000,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Preorder created successfully",
    "preorder": {
      "id": 1,
      "variantId": 5,
      "expectedArrivalDate": "2026-01-15T00:00:00.000Z",
      "maximumQuantity": 100,
      "currentPreorders": 0,
      "preorderPrice": 75000,
      "isActive": true,
      "variant": {
        "product": {
          "id": 2,
          "name": "Gaming Laptop",
          "slug": "gaming-laptop",
          "brand": "ASUS"
        }
      }
    }
  }
}
```

**Error Responses:**
- `400` - Active preorder already exists for this variant
- `404` - Product variant not found or inactive

---

### Admin: Update Preorder

**PUT** `/api/v1/admin/preorders/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "expectedArrivalDate": "2026-01-20T00:00:00.000Z",
  "maximumQuantity": 150,
  "currentPreorders": 30,
  "preorderPrice": 70000,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Preorder updated successfully",
    "preorder": {...}
  }
}
```

**Error Responses:**
- `400` - currentPreorders cannot exceed maximumQuantity
- `404` - Preorder not found

---

### Admin: Delete Preorder

**DELETE** `/api/v1/admin/preorders/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Preorder deleted successfully"
  }
}
```

**Error Responses:**
- `400` - Cannot delete preorder with active preorders. Deactivate instead.
- `404` - Preorder not found

**Note:** Preorders with `currentPreorders > 0` cannot be deleted. Deactivate them instead.

---

## Payment Management

All payment endpoints require admin authentication.

### Get All Payments

**GET** `/api/v1/admin/payments`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `method` - Filter by payment method (cod, bkash, nagad, rocket, card)
- `status` - Filter by payment status (pending, paid, failed, cancelled, refunded)
- `orderId` - Filter by order ID
- `startDate` - Start date filter
- `endDate` - End date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "orderId": 1,
        "method": "cod",
        "status": "paid",
        "amount": 1940,
        "currency": "BDT",
        "collectedBy": "SteadFast",
        "collectedAt": "2025-12-15T10:00:00.000Z",
        "courierTrackingNumber": "SF123456789",
        "verifiedBy": 1,
        "verifiedAt": "2025-12-15T10:00:00.000Z",
        "notes": "Payment collected from SteadFast",
        "order": {
          "id": 1,
          "user": {...}
        }
      }
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### Get Payment by ID

**GET** `/api/v1/admin/payments/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Full payment details with order and user information.

---

### Get Payment by Order ID

**GET** `/api/v1/admin/payments/order/:orderId`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Payment details for the specified order.

---

### Verify COD Payment

**PUT** `/api/v1/admin/payments/:id/verify`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "collectedBy": "SteadFast",
  "collectedAt": "2025-12-20T14:00:00.000Z",
  "notes": "Payment verified - order was delivered"
}
```

**Business Logic**:
- ✅ **If order status = "delivered"** → Payment automatically marked as **PAID**
- ❌ **If order status ≠ "delivered"** → Returns error (payment can only be verified when delivered)
- ✅ **If order status = "cancelled/refunded"** → Payment marked as **REFUNDED**

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Payment verified successfully (Order was delivered)",
    "payment": {...}
  }
}
```

**Note**: This endpoint only works for COD payments. Payment can only be verified if the order is delivered.

---

### Mark Payment as Collected from Courier (Bulk Collection)

**PUT** `/api/v1/admin/payments/:id/collect-from-courier`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "courierName": "SteadFast",
  "courierTrackingNumber": "SF123456789",
  "collectedAt": "2025-12-20T14:00:00.000Z",
  "notes": "Bulk collection from SteadFast for week of Dec 15-20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Payment collected from SteadFast and marked as paid (order was delivered)",
    "payment": {...}
  }
}
```

**Behavior**:
- Records payment collection from courier
- If order is already delivered → Payment automatically marked as **PAID**
- If order not delivered yet → Payment remains **PENDING** until delivery

---

### Update Payment Status

**PUT** `/api/v1/admin/payments/:id/status`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "status": "paid",
  "notes": "Payment verified manually",
  "transactionId": "TXN123456",
  "senderNumber": "01712345678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Payment status updated successfully",
    "payment": {...}
  }
}
```

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
  "codCollected": false, // Optional
  "courierName": "SteadFast", // Optional - Courier service name (SteadFast, Pathao, SA Paribahan)
  "courierTrackingNumber": "SF123456789" // Optional - Tracking number from courier
}
```

**Response includes**:
- `courierName` - Courier service name
- `courierTrackingNumber` - Tracking number

**Note**: When updating order status to "delivered" for COD orders, payment is automatically marked as "paid".

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

**Automatic Payment Update**:
- When order status changes to **"delivered"** and payment method is **COD**:
  - Payment status automatically changes to **"paid"**
  - `codCollected` set to `true`
  - Payment verified by admin who updated status
  - Payment notes updated with courier information

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

## Role & Permission Management

All role and permission endpoints require admin authentication.

### Get All Roles

**GET** `/api/v1/admin/roles`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `isActive` - Filter by active status (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Administrator role",
        "isActive": true,
        "_count": {
          "adminUsers": 5,
          "permissions": 20
        }
      }
    ],
    "meta": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### Get Role by ID

**GET** `/api/v1/admin/roles/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Full role details with assigned users and permissions.

---

### Create Role

**POST** `/api/v1/admin/roles`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "manager",
  "description": "Manager role",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Role created successfully",
    "role": {
      "id": 2,
      "name": "manager",
      "description": "Manager role",
      "isActive": true
    }
  }
}
```

---

### Update Role

**PUT** `/api/v1/admin/roles/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "manager",
  "description": "Updated description",
  "isActive": true
}
```

---

### Delete Role

**DELETE** `/api/v1/admin/roles/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Note**: Cannot delete role if assigned to any admin users.

---

### Assign Permissions to Role

**POST** `/api/v1/admin/roles/:id/permissions`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "permissionIds": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Permissions assigned successfully",
    "role": {
      "id": 2,
      "name": "manager",
      "permissions": [
        {
          "permission": {
            "id": 1,
            "name": "product:read",
            "module": "product",
            "action": "read"
          }
        }
      ]
    }
  }
}
```

---

### Get All Permissions

**GET** `/api/v1/admin/permissions`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Query Parameters:**
- `module` - Filter by module (optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "id": 1,
        "name": "product:read",
        "description": "Read products",
        "module": "product",
        "action": "read",
        "_count": {
          "roles": 3
        }
      }
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
}
```

---

### Get Permission by ID

**GET** `/api/v1/admin/permissions/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:** Full permission details with assigned roles.

---

### Create Permission

**POST** `/api/v1/admin/permissions`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "product:create",
  "description": "Create products",
  "module": "product",
  "action": "create"
}
```

---

### Update Permission

**PUT** `/api/v1/admin/permissions/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "name": "product:create",
  "description": "Updated description",
  "module": "product",
  "action": "create"
}
```

---

### Delete Permission

**DELETE** `/api/v1/admin/permissions/:id`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

---

### Assign Role to Admin User

**PUT** `/api/v1/admin/users/:id/role`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "roleId": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Role assigned successfully",
    "adminUser": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@example.com",
      "role": {
        "id": 2,
        "name": "manager",
        "permissions": [...]
      }
    }
  }
}
```

---

## Admin User Management

### Get Admin Profile (Admin Only)

**GET** `/api/v1/admin/profile`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 1,
      "fullName": "Admin User",
      "phone": "01712345678",
      "email": "admin@example.com",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "roles": [
        {
          "id": 1,
          "name": "admin",
          "description": "Administrator role",
          "isActive": true,
          "assignedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### Update Admin Profile (Admin Only)

**PUT** `/api/v1/admin/profile`

**Headers:**
- `Authorization: Bearer <access_token>` (Admin)

**Body:**
```json
{
  "fullName": "Updated Name",
  "phone": "01712345678",
  "email": "newemail@example.com"
}
```

**Validation Rules:**
- `fullName`: 2-60 characters (optional)
- `phone`: Valid Bangladeshi phone number (01[1-9]XXXXXXXX) (optional)
- `email`: Valid email format (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 1,
      "fullName": "Updated Name",
      "phone": "01712345678",
      "email": "newemail@example.com",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "roles": [...]
    },
    "message": "Profile updated successfully"
  }
}
```

**Note:** 
- Cannot update `isActive` status through profile endpoint
- Email and phone must be unique across all admin users
- All fields are optional - only provided fields will be updated

---

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

### Wishlist Features

- **User-specific**: Each user has their own wishlist
- **Duplicate prevention**: Same variant cannot be added twice
- **Product details**: Includes full product information, prices, images, and availability
- **Add to cart**: Wishlist items can be directly added to cart
- **Availability tracking**: Shows real-time stock availability

### Preorder Features

- **Automatic detection**: When creating orders, system automatically detects if items have active preorders
- **Preorder pricing**: Preorder price is used instead of regular price when available
- **Inventory handling**: Preorder items do NOT reserve inventory (no stock yet)
- **Count tracking**: System tracks how many customers have preordered
- **Available slots**: Calculated as `maximumQuantity - currentPreorders`
- **Order integration**: Preorder items are marked with `isPreorder: true` in order items

### Preorder Business Logic

When a customer creates an order:
1. System checks if any cart items have active preorders
2. If preorder exists:
   - Uses preorder price for that item
   - Marks order item as `isPreorder: true`
   - Increments preorder count (`currentPreorders`)
   - Does NOT reserve inventory
3. If no preorder:
   - Uses regular price
   - Marks as `isPreorder: false`
   - Reserves inventory as normal

**Important**: Preorder items are included in order totals calculation, but inventory is not reserved until the product arrives.

---

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

### Courier Tracking (COD Orders)

**For COD Orders**:
- `courierName` - Courier service name (e.g., "SteadFast", "Pathao", "SA Paribahan")
- `courierTrackingNumber` - Tracking number from courier service

**Payment Verification Flow**:
1. Order sent to courier → Add `courierName` and `courierTrackingNumber` to order
2. Courier delivers → Customer pays courier
3. Admin updates order status to "delivered" → Payment automatically marked as "paid"
4. Admin collects payment from courier (bulk) → Record collection via payment endpoint

**Business Rule**: If order is delivered → Payment is automatically PAID (customer paid courier)

### Advanced Search Features

**Full-Text Search**:
- Searches across product name, description, brand, and specifications
- Case-insensitive matching
- Token-based search (handles multiple words)

**Relevance Ranking**:
- Products sorted by match quality when `relevanceSort=true`
- Higher scores for exact matches, name matches, brand matches
- Includes relevance score and match details in response

**Faceted Search**:
- Get available filters (brands, prices, attributes, categories)
- Use `includeFacets=true` parameter
- Helps users refine their search

**Autocomplete**:
- Real-time search suggestions
- Endpoint: `GET /api/v1/product/search/suggestions`
- Returns products and brands matching query

### Email Notifications

**Automatic Email Notifications**:
- Order confirmation emails sent when order is created
- Shipping update emails sent when order status changes (processing, shipped, delivered)
- Password reset emails (can be integrated)

**Configuration**:
- Set `EMAIL_WORKER_URL` environment variable to enable email sending
- If not configured, emails are logged but not sent (useful for development)
- Supports Cloudflare Email Workers or external email services

---

## Support

For API support or questions, please contact the development team.

**Last Updated:** December 2025

