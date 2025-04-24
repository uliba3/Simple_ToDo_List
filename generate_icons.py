from PIL import Image
import os

def resize_image(input_path, output_path, width, height):
    # Open the image
    with Image.open(input_path) as img:
        # Resize the image while maintaining aspect ratio
        img.thumbnail((width, height), Image.Resampling.LANCZOS)
        # Create a new image with the target size and white background
        new_img = Image.new('RGB', (width, height), (255, 255, 255))
        # Paste the resized image in the center
        paste_x = (width - img.width) // 2
        paste_y = (height - img.height) // 2
        new_img.paste(img, (paste_x, paste_y))
        # Save the resized image
        new_img.save(output_path, 'PNG')

# Create output directory if it doesn't exist
output_dir = 'store-assets/resized'
os.makedirs(output_dir, exist_ok=True)

# Process all PNG files in store-assets
sizes = [(1280, 800), (640, 400)]
for filename in os.listdir('store-assets'):
    if filename.endswith('.png'):
        input_path = os.path.join('store-assets', filename)
        for width, height in sizes:
            output_path = os.path.join(output_dir, f'{os.path.splitext(filename)[0]}_{width}x{height}.png')
            resize_image(input_path, output_path, width, height)

print("Images resized successfully!") 