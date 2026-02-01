import os
import yaml
import time
import datetime
from xml.dom import minidom
import xml.etree.ElementTree as ET

# Configuration filenames
CONFIG_FILE = 'config.yaml'
OUTPUT_FILE = 'blog.xml'

# Exclude list (files and directory names)
EXCLUDES = {
    'blog.xml', 'config.yaml', 'install.sh', 'update.sh', 
    'venv', 'main.py', 'package.json', 'package-lock.json',
    'node_modules', 'dist', 'public'
}

def load_config():
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def get_file_info(filepath, root_dir):
    filename = os.path.basename(filepath)
    rel_path = os.path.relpath(filepath, root_dir)
    
    # Get Modification Time
    mtime_ts = os.path.getmtime(filepath)
    mtime = str(mtime_ts)
    
    # Extract Title (filename without extension)
    title = os.path.splitext(filename)[0]

    return {
        'title': title,
        'mtime': mtime,
        'path': rel_path
    }

def main():
    root_dir = os.path.abspath('.')
    config = load_config()
    content_base_url = config.get('contenturl', '')
    if not content_base_url.endswith('/'):
        content_base_url += '/'

    notes = []

    # Get all items in current directory
    items = sorted(os.listdir(root_dir))

    for item in items:
        # Ignore hidden files/dirs and explicitly excluded items
        if item.startswith('.') or item in EXCLUDES:
            continue

        abs_path = os.path.join(root_dir, item)

        if os.path.isfile(abs_path):
            # Depth 0: Files in root (Category: None/Empty)
            if item.lower().endswith('.md'): # Only processing MD files as per implication of "blog"
                info = get_file_info(abs_path, root_dir)
                info['category'] = ''
                info['url'] = content_base_url + info['path']
                notes.append(info)

        elif os.path.isdir(abs_path):
            # Depth 1: Directories (Category: Folder Name)
            category = item
            sub_items = sorted(os.listdir(abs_path))
            for sub_item in sub_items:
                if sub_item.startswith('.'):
                    continue
                    
                sub_abs_path = os.path.join(abs_path, sub_item)
                if os.path.isfile(sub_abs_path) and sub_item.lower().endswith('.md'):
                    info = get_file_info(sub_abs_path, root_dir)
                    info['category'] = category
                    info['url'] = content_base_url + info['path']
                    notes.append(info)

    # Generate XML
    root = ET.Element('blog')
    
    for note in notes:
        note_elem = ET.SubElement(root, 'note')
        
        # Add sub-elements for each field
        ET.SubElement(note_elem, 'title').text = note['title']
        ET.SubElement(note_elem, 'mtime').text = note['mtime']
        ET.SubElement(note_elem, 'path').text = note['path']
        ET.SubElement(note_elem, 'url').text = note['url']
        ET.SubElement(note_elem, 'category').text = note['category']

    # Pretty print XML
    xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"Successfully updated {OUTPUT_FILE} with {len(notes)} notes.")

if __name__ == "__main__":
    main()
