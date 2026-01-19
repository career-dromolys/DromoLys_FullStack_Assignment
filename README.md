# CSV Analyzer (Full Stack Assignment)

A web application to upload CSV files, preview data, and generate statistics and histograms for selected columns.

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- Recharts
- React Icons

**Backend**
- Node.js
- Express.js
- MongoDB (Database: CSV)
- Mongoose
- Multer
- dotenv
- CSV Parser

---

## Setup & Run Instructions

### Run Locally

#### Backend
```bash
cd backend
npm install
npm start
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Assumptions

- CSV must contain headers in the first row
- Only .csv files are supported
- Statistics and histograms apply to numeric columns
- Empty values are counted as missing values

## Limitations

- No authentication implemented
- Large CSV files may affect performance
- Complex CSV formats (quoted/multiline) may not be fully supported
- No dataset history persistence

## Tie-Handling Logic

- If multiple values have the same highest frequency (mode), one valid mode is returned
- If no valid mode exists, backend returns "Not applicable"
- Median for even number of values is calculated as average of two middle values


