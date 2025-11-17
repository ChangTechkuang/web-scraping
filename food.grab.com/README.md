# GrabFood Restaurant Data Scraper

A sophisticated web scraping solution for extracting comprehensive restaurant data from [GrabFood Singapore](https://food.grab.com/sg/en/restaurants). This project demonstrates API-based scraping techniques, handling authentication tokens, and managing paginated API responses.

## 📋 Project Overview

This scraper extracts detailed restaurant information from GrabFood's platform using a hybrid approach: it first retrieves initial configuration data from the web page, then leverages the underlying API endpoints to efficiently collect restaurant listings with full pagination support.

## ✨ Features

- **API-Based Scraping**: Utilizes GrabFood's internal API endpoints for efficient data extraction
- **Hybrid Approach**: Extracts configuration from web page, then uses API for data retrieval
- **Automatic Pagination**: Handles infinite scroll pagination with `hasMore` flag detection
- **Comprehensive Data Extraction**: Extracts 12+ data fields per restaurant
- **Authentication Handling**: Manages JWT tokens and custom headers for API access
- **Robust Error Handling**: Implements comprehensive error handling and status reporting
- **Location-Based**: Supports location-based restaurant search (Singapore)
- **Data Normalization**: Cleans and normalizes extracted data

## 📊 Extracted Data Fields

Each restaurant entry includes:

- **`id`**: Unique restaurant identifier
- **`name`**: Restaurant name
- **`cuisine`**: Array of cuisine types (e.g., ["Italian", "Pizza"])
- **`distanceInKm`**: Distance from search location in kilometers
- **`rating`**: Customer rating (numeric)
- **`voteCount`**: Number of customer reviews/votes
- **`photo`**: Restaurant photo URL
- **`address`**: Complete address object with location details
- **`openHours`**: Operating hours information
- **`status`**: Current restaurant status (e.g., "OPEN", "CLOSED")
- **`promo`**: Promotional offers and discounts
- **`deliverBy`**: Estimated delivery time
- **`priceTag`**: Price range indicator

## 🛠️ Technical Architecture

### Technology Stack
- **Language**: JavaScript
- **Architecture**: Object-oriented design with prototype-based inheritance
- **API Integration**: RESTful API endpoints with POST requests
- **Authentication**: JWT token-based authentication
- **Data Format**: JSON request/response handling

### Key Components

- **`VIEW` Class**: Main scraping controller orchestrating the extraction process
- **`iSASObject`**: Base object providing logging and error handling utilities
- **API Request Handler**: Manages authenticated API requests with custom headers
- **Pagination Manager**: Handles infinite scroll pagination logic
- **Data Parser**: Processes JSON responses and extracts structured data

### Scraping Approach

1. **Initial Page Load**: Retrieves the main restaurant listing page
2. **Configuration Extraction**: Extracts `latlng`, `pageSize`, and `offset` from page payload
3. **API Authentication**: Sets up required headers including JWT tokens and cookies
4. **API Requests**: Makes POST requests to `/foodweb/guest/v2/search` endpoint
5. **Pagination**: Automatically handles pagination using `hasMore` flag and offset updates
6. **Data Extraction**: Parses JSON responses and structures restaurant data

### API Endpoints Used

- **Web Page**: `https://food.grab.com/sg/en/restaurants`
- **Search API**: `https://portal.grab.com/foodweb/guest/v2/search`

## 🚀 Usage

### Framework Requirements

The script is designed to work within a scraping framework that provides:
- `httpRequest` object for HTTP operations (GET and POST)
- `system` object for status management and progress tracking
- `StrGrab`, `StrReplace` utility functions for string manipulation
- Error code constants for standardized error handling

### Execution Flow

1. **Initialization**: `OnInit()` sets up the environment and loads dependencies
2. **Execution**: `Execute(aInput)` processes the input JSON configuration
3. **Web Page Scraping**: Retrieves initial page to extract configuration data
4. **API Request**: Makes authenticated POST request to search API
5. **Data Extraction**: Parses JSON and extracts restaurant information
6. **Pagination**: Continues fetching until all pages are processed
7. **Output**: Returns structured JSON with all restaurant data

### Input Format

```json
{
  "Class": "VIEW",
  "Module": "RESTAURANTS",
  "Input": {}
}
```

### Output Format

```json
{
  "Output": {
    "ErrorCode": "00000000",
    "ErrorMessage": "",
    "Result": [
      {
        "id": "restaurant_id",
        "name": "Restaurant Name",
        "cuisine": ["Italian", "Pizza"],
        "distanceInKm": 2.5,
        "rating": 4.5,
        "voteCount": 1234,
        "photo": "https://...",
        "address": {...},
        "openHours": {...},
        "status": "OPEN",
        "promo": {...},
        "deliverBy": "30-40 min",
        "priceTag": "$$"
      }
    ]
  }
}
```

## 📈 Technical Highlights

### Authentication & Headers

The scraper handles complex authentication requirements:
- **JWT Tokens**: Manages authentication tokens in headers
- **Custom Headers**: Includes GrabFood-specific headers:
  - `X-Grab-Web-App-Version`
  - `X-Hydra-JWT`
  - `X-GFC-Country`
  - `X-Country-Code`
- **Cookies**: Maintains session cookies for authenticated requests

### Pagination Strategy

- Detects `hasMore` flag in API responses
- Automatically updates `offset` for subsequent requests
- Continues until all restaurants are retrieved
- Handles edge cases and empty responses

### Error Handling

- Validates API responses before parsing
- Handles JSON parsing errors gracefully
- Provides detailed error codes and messages
- Implements try-catch blocks for exception handling

## ⚠️ Ethical Considerations

### Important Notes

- **API Usage**: This scraper uses GrabFood's internal API endpoints
- **Rate Limiting**: Implement appropriate delays between requests
- **Terms of Service**: Review and comply with GrabFood's terms of service
- **Authentication Tokens**: Tokens may expire and require updates
- **Educational Purpose**: This project is for educational and portfolio purposes

### Best Practices

- ✅ Respect API rate limits
- ✅ Use appropriate delays between requests
- ✅ Handle authentication token expiration
- ✅ Monitor for API changes
- ✅ Implement error recovery mechanisms
- ✅ Cache results when possible to reduce API calls

### Legal Compliance

- Ensure compliance with GrabFood's terms of service
- Respect data protection regulations
- Use scraped data responsibly
- Consider using official APIs if available

## 🔧 Configuration

### Target Location

Currently configured for **Singapore**:
- Country Code: `SG`
- Base URL: `https://food.grab.com/sg/en/restaurants`

### Customization Options

To adapt for different locations:
1. Update `this.url` path (e.g., `/my/en/restaurants` for Malaysia)
2. Modify `countryCode` in POST data
3. Update `X-GFC-Country` and `X-Country-Code` headers
4. Adjust location coordinates (`latlng`) if needed

## 📚 Use Cases

This scraper is suitable for:
- **Market Research**: Analyzing restaurant landscape in Singapore
- **Competitive Analysis**: Comparing restaurant offerings and pricing
- **Data Analytics**: Building datasets for food delivery market analysis
- **Price Monitoring**: Tracking restaurant prices and promotions
- **Location Intelligence**: Understanding restaurant distribution
- **Portfolio Projects**: Demonstrating API scraping capabilities

## 🎯 Key Technical Challenges Solved

1. **API Discovery**: Identified internal API endpoints from web page analysis
2. **Authentication**: Handled JWT tokens and complex header requirements
3. **Pagination**: Implemented infinite scroll pagination with offset management
4. **Data Parsing**: Extracted nested JSON structures and handled missing fields
5. **Error Recovery**: Implemented robust error handling for API failures

## 👤 Author

GrabFood Restaurant Data Scraper
