import pandas as pd

# Load the CSV file
csv_path = 'data.csv'
data = pd.read_csv(csv_path)

# Convert CSV data to JSON
json_data = data.to_json(orient='records')
open('data.json', 'w').write(json_data)
