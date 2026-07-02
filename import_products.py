import pandas as pd
import mysql.connector

# Đọc file CSV
df = pd.read_csv("unuquan_menu.csv")

# Kết nối MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",   # đổi thành password của m
    database="ecommerce_db"
)

cursor = conn.cursor()

# Import từng món
for _, row in df.iterrows():
    sql = """
    INSERT INTO products (
        category_id,
        promotion_id,
        name,
        description,
        old_price,
        new_price,
        stock,
        thumbnail
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        1,                      # category_id
        1,                      # promotion_id
        row["name"],
        row["name"],
        row["price"],
        row["price"],
        100,                    # stock
        row["image"]
    )

    cursor.execute(sql, values)

conn.commit()

print(f"Đã import {len(df)} món ăn")

cursor.close()
conn.close()