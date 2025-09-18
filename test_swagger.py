#!/usr/bin/env python3
"""
Test script to verify Swagger integration with the Flask API
"""
import requests
import time
import sys

def test_swagger_endpoints():
    """Test that Swagger endpoints are working"""
    base_url = "http://localhost:5000"
    
    endpoints_to_test = [
        ("/swagger/", "Swagger UI"),
        ("/apispec_1.json", "OpenAPI JSON Spec"),
        ("/api/docs", "API Docs redirect"),
        ("/v1/helloworld", "Hello World API"),
        ("/health", "Health Check")
    ]
    
    print("🧪 Testing Swagger Integration...")
    print("=" * 50)
    
    all_passed = True
    
    for endpoint, description in endpoints_to_test:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, allow_redirects=False, timeout=10)
            
            if endpoint == "/api/docs":
                # This should redirect
                status = "✅ PASS" if response.status_code == 302 else "❌ FAIL"
            else:
                status = "✅ PASS" if response.status_code == 200 else "❌ FAIL"
            
            print(f"{description:25} | Status: {response.status_code} | {status}")
            
            if response.status_code not in [200, 302]:
                all_passed = False
                
        except requests.exceptions.ConnectionError:
            print(f"{description:25} | Status: Connection Failed | ❌ FAIL")
            print("  ⚠️  Make sure the Flask server is running on localhost:5000")
            all_passed = False
        except Exception as e:
            print(f"{description:25} | Status: Error | ❌ FAIL ({str(e)})")
            all_passed = False
    
    print("=" * 50)
    
    if all_passed:
        print("🎉 All Swagger endpoints are working!")
        print("\n📖 Access Swagger UI at: http://localhost:5000/swagger/")
        print("📄 OpenAPI spec at: http://localhost:5000/apispec_1.json")
        return 0
    else:
        print("❌ Some endpoints failed. Check the server logs.")
        return 1

if __name__ == "__main__":
    exit_code = test_swagger_endpoints()
    sys.exit(exit_code)
