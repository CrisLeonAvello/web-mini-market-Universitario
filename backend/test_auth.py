#!/usr/bin/env python3
"""
Script para probar login
"""

import httpx
import json

def test_login():
    """Probar endpoint de login"""
    try:
        url = "http://localhost:8000/api/auth/login"
        data = {
            "email": "admin@admin.com",
            "password": "admin123"
        }
        
        with httpx.Client() as client:
            response = client.post(url, json=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login exitoso!")
            print(f"Token: {token_data.get('access_token', 'No token')[:50]}...")
        else:
            print(f"❌ Login fallido: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_invalid_login():
    """Probar login con credenciales inválidas"""
    try:
        url = "http://localhost:8000/api/auth/login"
        data = {
            "email": "usuario@inexistente.com",
            "password": "password_incorrecto"
        }
        
        with httpx.Client() as client:
            response = client.post(url, json=data)
        
        print(f"\n--- Prueba con credenciales inválidas ---")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("✅ Validación correcta - rechaza credenciales inválidas")
        else:
            print("❌ Problema - no está rechazando credenciales inválidas")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("=== Probando sistema de autenticación ===")
    test_login()
    test_invalid_login()