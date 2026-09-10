from fastapi import FastAPI, HTTPException, Depends, Query
from datetime import datetime, timezone
from typing import List, Optional
from .database import products_collection, get_database
from .schemas import ProductCreate, ProductUpdate, ProductResponse
from bson import ObjectId

app = FastAPI(title="Product Management API", version="1.0.0")


def product_helper(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "sku": product["sku"],
        "price": product["price"],
        "status": product["status"],
        "created_at": product["created_at"],
    }


@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(search: Optional[str] = Query(None)):
    query = {}
    if search:
        query = {
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"sku": {"$regex": search, "$options": "i"}},
            ]
        }
    products = await products_collection.find(query).sort("created_at", -1).to_list(1000)
    return [product_helper(p) for p in products]


@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(product)


@app.post("/api/products", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate):
    existing = await products_collection.find_one({"sku": product.sku})
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    product_data = product.model_dump()
    product_data["created_at"] = datetime.now(timezone.utc)
    result = await products_collection.insert_one(product_data)
    created_product = await products_collection.find_one({"_id": result.inserted_id})
    return product_helper(created_product)


@app.put("/api/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    existing = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product.model_dump(exclude_unset=True)
    if "sku" in update_data:
        sku_exists = await products_collection.find_one({
            "sku": update_data["sku"],
            "_id": {"$ne": ObjectId(product_id)}
        })
        if sku_exists:
            raise HTTPException(status_code=400, detail="SKU already exists")
    if update_data:
        await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
    updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
    return product_helper(updated_product)


@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
