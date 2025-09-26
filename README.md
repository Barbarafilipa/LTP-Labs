# Features

## Homepage

- Fetches and displays a list of products from the DummyJSON API.
- Products can be:
  - Filtered by category (via checkboxes).
  - Sorted by title (A-Z) or price (low to high / high to low).
- Pagination is implemented to help navigate through the product list.
- Each product links to its own detail page.

## Product Detail Page

- Fetches and displays detailed product information from the API.
- Includes:
  - Title, description, price.
  - Image gallery with a slider (using keen-slider).
- Users can add the product to the shopping cart via the “Add to Cart” button.

## Shopping Cart
- Accessible via the shopping bag icon.
- Displays:
  - All products added to the cart.
  - The quantity of each product.
  - Subtotal, shipping, and total price.
- Functionality:
  - Increment and decrement quantity.
  - Remove products from the cart.
- Cart state is managed via Remix loaders, actions, and cookies.

# Tech Stacks

- Remix
- Tailwind CSS
- keen-slider
- Lucide React
- DummyJSON API

# Design

- Responsive for both mobile and desktop.

# How to Run
### Clone the repo
```
git clone git@github.com:Barbarafilipa/LTP-Labs.git
cd my-remix-app
```

### Install dependencies
```npm install```

### Run the dev server
```npm run dev```
