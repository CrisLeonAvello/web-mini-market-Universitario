#!/usr/bin/env python3
"""
Script para probar registro de usuarios
"""

import httpx
import json

def test_register():
    """Probar endpoint de registro"""
    try:
        url = "http://localhost:8000/api/auth/register"
        data = {
            "email": "test@user.com",
            "password": "test123",
            "name": "Usuario Test"
        }
        
        with httpx.Client() as client:
            response = client.post(url, json=data)
        
        print(f"=== Prueba de Registro ===")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Registro exitoso!")
            print(f"Usuario ID: {user_data.get('id')}")
            print(f"Email: {user_data.get('email')}")
            print(f"Nombre: {user_data.get('name')}")
        else:
            print(f"❌ Registro fallido: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_login_new_user():
    """Probar login con el usuario recién creado"""
    try:
        url = "http://localhost:8000/api/auth/login"
        data = {
            "email": "test@user.com",
            "password": "test123"
        }
        
        with httpx.Client() as client:
            response = client.post(url, json=data)
        
        print(f"\n=== Prueba de Login con Usuario Nuevo ===")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login exitoso con usuario nuevo!")
            print(f"Token: {token_data.get('access_token', 'No token')[:50]}...")
            return token_data.get('access_token')
        else:
            print(f"❌ Login fallido: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_user_info(token):
    """Probar obtener información del usuario con token"""
    if not token:
        print("No hay token para probar")
        return
        
    try:
        url = "http://localhost:8000/api/auth/me"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        with httpx.Client() as client:
            response = client.get(url, headers=headers)
        
        print(f"\n=== Prueba de Obtener Info de Usuario ===")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ Información de usuario obtenida!")
            print(f"ID: {user_info.get('id')}")
            print(f"Email: {user_info.get('email')}")
            print(f"Nombre: {user_info.get('name')}")
        else:
            print(f"❌ Error obteniendo info: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("=== Prueba Completa del Sistema de Autenticación ===")
    test_register()
    token = test_login_new_user()
    test_get_user_info(token)