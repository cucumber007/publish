#!/usr/bin/env python3
import argparse
import sys


def main():
    parser = argparse.ArgumentParser(description='Basic CLI script')
    
    # Add arguments
    parser.add_argument('input', help='Input file or value')
    parser.add_argument('-o', '--output', help='Output file')
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Your script logic here
    print(f"Input: {args.input}")
    if args.output:
        print(f"Output: {args.output}")
    if args.verbose:
        print("Verbose mode enabled")


if __name__ == '__main__':
    main()
