from PIL import Image, ImageDraw

def create_icon(size):
    # Create a new image with a transparent background
    image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    
    # Calculate dimensions based on icon size
    border = size // 8
    line_spacing = size // 4
    line_width = size // 16
    
    # Draw a simple todo list design
    # Draw the paper background
    draw.rectangle([border, border, size-border, size-border], 
                  fill=(255, 255, 255, 255), outline=(200, 200, 200, 255))
    
    # Draw three lines to represent a todo list
    for i in range(3):
        y = size // 2 - line_spacing + (i * line_spacing)
        draw.line([size//4, y, size*3//4, y], 
                 fill=(100, 100, 100, 255), width=line_width)
    
    # Draw a checkmark on the first line
    check_size = size // 8
    check_x = size // 4 - check_size
    check_y = size // 2 - line_spacing - check_size // 2
    draw.line([check_x, check_y + check_size//2, 
               check_x + check_size//2, check_y + check_size],
             fill=(0, 200, 0, 255), width=line_width)
    draw.line([check_x + check_size//2, check_y + check_size,
               check_x + check_size, check_y],
             fill=(0, 200, 0, 255), width=line_width)
    
    return image

# Create icons in different sizes
sizes = [16, 48, 128]
for size in sizes:
    icon = create_icon(size)
    icon.save(f'icons/icon{size}.png')

print("Icons generated successfully!") 