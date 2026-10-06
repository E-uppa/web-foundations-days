# Library Books API

This API manages a library's books resource.

## Endpoints

### 1. List all books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Returns one book by its ID.
- **Success status:** `200 OK`

Example request:

```http
GET /books/42
```
