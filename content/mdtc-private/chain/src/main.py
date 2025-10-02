#!/usr/bin/env python3
import argparse
import sys
import xml.etree.ElementTree as ET
import os
from pathlib import Path


def parse_opml(file_path):
    """Parse OPML file and extract conversation structure"""
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    conversations = []
    
    # Find the main branch (skip "Chain" and look for branches with **)
    for outline in root.findall('.//outline'):
        if outline.get('text') and '**' in outline.get('text') and outline.get('text') != 'Chain':
            # This is a branch like "**Intro branch**"
            branch_name = outline.get('text').replace('**', '').strip().replace(' ', '_').lower()
            
            # Find messages in this branch - look for message nodes
            messages = []
            
            # Look for message nodes (like "Intro") within this branch
            for msg_node in outline.findall('.//outline'):
                if msg_node.get('text') and msg_node.get('text') not in ['User', 'AI', 'Chain'] and '**' not in msg_node.get('text'):
                    # This is a message node like "Intro"
                    message_id = msg_node.get('text').lower()
                    
                    # Find User and AI content within this message node
                    current_message = {}
                    
                    for msg_outline in msg_node.findall('.//outline'):
                        if msg_outline.get('text') in ['User', 'AI']:
                            msg_type = msg_outline.get('text')
                            content_parts = []
                            
                            # Get all content from child outline elements
                            for content_outline in msg_outline.findall('.//outline'):
                                if content_outline.get('text') and content_outline.get('text') not in ['User', 'AI']:
                                    content_parts.append(content_outline.get('text'))
                            
                            if content_parts:
                                content = '\n\n'.join(content_parts)
                                current_message[msg_type.lower()] = content
                    
                    # If we have both user and ai, we have a complete message
                    if 'user' in current_message and 'ai' in current_message:
                        messages.append({
                            'message_id': message_id,
                            'user': current_message['user'],
                            'ai': current_message['ai']
                        })
            
            if messages:
                conversations.append({
                    'branch_name': branch_name,
                    'messages': messages
                })
    
    return conversations


def clear_messages_folder(base_path):
    """Clear the messages folder before parsing"""
    base_path = Path(base_path)
    if base_path.exists():
        import shutil
        shutil.rmtree(base_path)
        print(f"Cleared {base_path}")
    base_path.mkdir(exist_ok=True)


def format_messages(conversations, base_path):
    """Format conversations according to format.md specification"""
    base_path = Path(base_path)
    
    for conv in conversations:
        branch_path = base_path / conv['branch_name']
        branch_path.mkdir(exist_ok=True)
        
        for msg in conv['messages']:
            msg_folder = branch_path / msg['message_id']
            msg_folder.mkdir(exist_ok=True)
            
            # Create user.md file
            user_file = msg_folder / 'user.md'
            with open(user_file, 'w', encoding='utf-8') as f:
                f.write(f"# User\n\n{msg['user']}")
            print(f"Created: {user_file}")
            
            # Create x_ai.md file
            ai_file = msg_folder / 'x_ai.md'
            with open(ai_file, 'w', encoding='utf-8') as f:
                f.write(f"# AI\n\n{msg['ai']}")
            print(f"Created: {ai_file}")


def main():
    parser = argparse.ArgumentParser(description='Chain message parser')
    parser.add_argument('command', help='Command to run (parse)')
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    if args.command == 'parse':
        # Clear messages folder first
        clear_messages_folder('./messages')
        
        # Parse messages.opml
        opml_path = 'messages.opml'
        if not os.path.exists(opml_path):
            print(f"Error: {opml_path} not found")
            sys.exit(1)
        
        if args.verbose:
            print(f"Parsing {opml_path}...")
        
        conversations = parse_opml(opml_path)
        
        if args.verbose:
            print(f"Found {len(conversations)} conversation branches")
        
        # Format and save messages
        format_messages(conversations, './messages')
        
        print("Parsing complete!")
    else:
        print(f"Unknown command: {args.command}")
        sys.exit(1)


if __name__ == '__main__':
    main()