# Web Scraping - Books to Scrape Data Extraction

A robust web scraping solution for extracting comprehensive book data from [Books to Scrape](https://books.toscrape.com), a practice website designed for web scraping exercises.

## 📋 Project Overview

This project implements a complete web scraping system that navigates through multiple pages of book listings, extracts detailed information from each book's product page, and structures the data in a clean, organized format.

## ✨ Features

- **Multi-page Scraping**: Automatically navigates through paginated book listings
- **Comprehensive Data Extraction**: Extracts both listing and detailed product information
- **Robust Error Handling**: Implements proper error handling and status reporting
- **Data Normalization**: Cleans HTML entities and special characters
- **Rating Conversion**: Converts text-based star ratings to numeric values
- **Image URL Resolution**: Properly handles relative and absolute image URLs

## 📊 Extracted Data Fields

### Listing Page Data
- **Title**: Book title
- **Price**: Book price
- **Availability**: Stock status
- **Link**: Direct URL to book detail page
- **Rating**: Star rating (1-5)

### Detail Page Data
- **Quantity**: Available stock quantity
- **Description**: Product description
- **Image**: Book cover image URL
- **Product Information Table**:
  - UPC Code
  - Product Type
  - Price (excluding tax)
  - Price (including tax)
  - Tax amount
  - Availability details
  - Number of reviews

## 🛠️ Technical Details

### Technology Stack
- **Language**: JavaScript
- **Target Site**: Books to Scrape (practice website)
- **Architecture**: Object-oriented design with prototype-based inheritance

### Key Components
- `VIEW` class: Main scraping controller
- `iSASObject`: Base object with logging and error handling
- Custom string manipulation utilities
- HTTP request handling with custom User-Agent headers

### Data Processing
- HTML tag removal and cleaning
- Special character normalization (HTML entities)
- URL path resolution and normalization
- Star rating text-to-number conversion

## 🚀 Usage

The script is designed to work within a scraping framework that provides:
- `httpRequest` object for HTTP operations
- `system` object for status management
- `StrGrab`, `StrReplace` utility functions
- Error code constants (e.g., `E_IBX_FAILTOGETPAGE`, `S_IBX_OK`)

### Execution Flow

1. **Initialization**: `OnInit()` sets up the environment
2. **Execution**: `Execute(aInput)` processes the input JSON
3. **Scraping**: `BOOKSCRAPEINFO()` performs the actual data extraction
4. **Output**: Returns structured JSON with extracted book data

## 📈 Performance Considerations

- Implements status reporting for progress tracking
- Handles pagination efficiently
- Processes detail pages sequentially to avoid overwhelming the server
- Includes proper error recovery mechanisms

## ⚠️ Ethical Considerations

This project is designed for educational purposes and scrapes a practice website specifically created for web scraping exercises. When scraping other websites:

- Always check `robots.txt`
- Respect rate limits
- Follow website terms of service
- Use appropriate delays between requests
- Consider using official APIs when available

## 📝 Version

Current Version: `25.11.13.1`

## 🔧 Data Output

- [ ] Enhance data export features (currently outputs JSON; can also convert to CSV and Excel)
- [ ] Implement parallel processing for detail pages
- [ ] Add retry mechanism for failed requests
- [ ] Create data validation and quality checks
- [ ] Add unit tests
- [ ] Implement caching mechanism

## 👤 Author

Web Scraping Data Extraction Project

---

**Note**: This project demonstrates web scraping capabilities and data extraction techniques. Always ensure compliance with website terms of service and applicable laws when scraping websites.