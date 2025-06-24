#!/usr/bin/env python3
"""
Script to open URLs with Selenium
"""

import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def default_action(driver, url):
    """Default action to perform on the opened page"""
    try:
        # Get page title
        title = driver.title
        print(f'Page title: {title}')
        
        # Get page source length
        source_length = len(driver.page_source)
        print(f'Page source length: {source_length} characters')
        
    except Exception as e:
        print(f'Error performing default action on {url}: {e}')

def open_url(url, action_func=None):
    """Open a URL with Selenium in headless mode"""
    try:
        options = Options()
        options.add_argument('--headless')
        driver = webdriver.Chrome(options=options)
        driver.get(url)
        print(f'Opened {url}')
        
        # Perform custom actions
        if action_func:
            action_func(driver, url)
        else:
            default_action(driver, url)
        
        driver.quit()
    except Exception as e:
        print(f'Error opening {url}: {e}')
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python selenium_open.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    open_url(url) 