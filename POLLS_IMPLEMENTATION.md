# Polls Feature Implementation

This document describes the implementation of the Polls/Markets feature for the mobile app, converted from the Figma design.

## Overview

The Polls screen displays a prediction market interface where users can:
- Browse trending polls
- Filter by category (Trending, Crypto, Sports)
- View market prices for YES/NO predictions
- Search for events
- View featured predictions

## Files Created

### Components

#### 1. `src/components/Polls/SearchBar.tsx`
- Search input component with search icon
- Styled with white background and border
- Placeholder: "Search for an event..."

#### 2. `src/components/Polls/CategoryFilter.tsx`
- Toggle buttons for different categories
- Categories: Trending 🔥, Crypto ₿, Sports ⚽️
- Supports multiple selections
- Active state styling with darker background

#### 3. `src/components/Polls/PredictionButton.tsx`
- Yes/No prediction buttons
- Shows current price
- Toggle selection on press
- Styled with dark background, green when selected

#### 4. `src/components/Polls/MarketCard.tsx`
- Display card for each market/poll
- Shows: category, price change, question, YES/NO prices, volume
- Two prediction buttons side-by-side
- Semi-transparent green background

#### 5. `src/components/Polls/FeaturedBanner.tsx`
- Featured poll banner at the top
- Uses LinearGradient for background
- Shows featured badge, title, and explore button
- Styled with large title text

#### 6. `src/components/ImageWithFallback.tsx`
- Utility component for images with error handling
- Shows placeholder when image fails to load
- Loading state with opacity transition

### Screens

#### `src/screens/Polls/PollsScreen.tsx`
Main polls screen with:
- Welcome header with user name
- Notifications button
- Profile button
- Search bar
- Featured banner
- Category filters
- Trending markets list
- Pull-to-refresh functionality

#### Updated: `src/screens/Home/HomeScreen.tsx`
- Now renders PollsScreen component
- Acts as wrapper for the polls feature

### Utilities

#### `src/utils/svgPaths.ts`
- Contains all SVG path data for icons
- Exported as a constant object
- Used for decorative SVG elements

### Types

#### Updated: `src/types/index.ts`
- Added comprehensive type definitions:
  - `User` - user profile type
  - `Poll` - poll/market data
  - `PollOption` - yes/no option details
  - `Bid` - bid/transaction type
  - `Transaction` - wallet transaction
  - `MarketDisplay` - UI display type for markets
  - `Notification` - notification type
  - `ApiResponse<T>` - API response wrapper
  - `RootStackParamList` - navigation types

## Component Structure

```
PollsScreen
├── Header Section
│   ├── Welcome message
│   ├── User name display
│   ├── Notification button
│   └── Profile button
├── SearchBar
├── FeaturedBanner
└── Content Section
    ├── Trending Header with "See All" button
    ├── CategoryFilter (Trending, Crypto, Sports)
    └── MarketsList
        └── MarketCard (for each market)
            ├── Category & Change Badge
            ├── Question Text
            ├── PredictionButton (YES)
            └── PredictionButton (NO)
```

## Styling

All components use React Native's StyleSheet with:
- Dark theme (black backgrounds)
- Green accents (#0f523c for active states)
- Gradient headers (LinearGradient from expo-linear-gradient)
- Consistent spacing and rounded corners
- Smooth animations and transitions

## Integration with Redux

- Uses `useSelector` to get user data from auth slice
- Prepared for future integration with polls slice
- Supports loading states and error handling

## API Integration

Ready for API integration with:
- `pollsAPI.getAll()` - Get all polls
- `pollsAPI.getById()` - Get specific poll
- `pollsAPI.getTrending()` - Get trending polls
- `pollsAPI.getMyBids()` - Get user's bids

## Navigation

The screen is accessible via the bottom tab navigation:
- Tab label: "Polls"
- Tab icon: poll icon from MaterialCommunityIcons
- Position: First tab in the bottom tab bar

## Future Enhancements

1. Real-time price updates via WebSocket
2. Voting/bidding functionality
3. Market details screen
4. User portfolio integration
5. Advanced filtering and sorting
6. Infinite scroll pagination
7. Pull-to-refresh data updates

## Notes

- Currently uses mock data for demonstration
- All API calls are commented and ready for implementation
- Components are fully typed with TypeScript
- Responsive design using Flexbox
- Follows React Native best practices

