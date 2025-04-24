from PIL import Image
import os

def resize_store_assets():
    """Resize store assets to 1280x800 and 640x400"""
    def resize_image(input_path, output_path, width, height):
        with Image.open(input_path) as img:
            img.thumbnail((width, height), Image.Resampling.LANCZOS)
            new_img = Image.new('RGB', (width, height), (255, 255, 255))
            paste_x = (width - img.width) // 2
            paste_y = (height - img.height) // 2
            new_img.paste(img, (paste_x, paste_y))
            new_img.save(output_path, 'PNG')

    output_dir = 'store-assets/resized'
    os.makedirs(output_dir, exist_ok=True)

    sizes = [(1280, 800), (640, 400)]
    for filename in os.listdir('store-assets'):
        if filename.endswith('.png'):
            input_path = os.path.join('store-assets', filename)
            for width, height in sizes:
                output_path = os.path.join(output_dir, f'{os.path.splitext(filename)[0]}_{width}x{height}.png')
                resize_image(input_path, output_path, width, height)

def resize_icons():
    """Resize icons to standard Chrome extension sizes"""
    def resize_icon(input_path, output_path, size):
        with Image.open(input_path) as img:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(output_path, 'PNG')

    input_image = 'icons/icon.png'
    sizes = [16, 48, 128]

    for size in sizes:
        output_path = f'icons/icon{size}.png'
        resize_icon(input_image, output_path, size)

# Resize store assets
resize_store_assets()

# Resize icons to standard sizes
resize_icons()

print("All images processed successfully!") 