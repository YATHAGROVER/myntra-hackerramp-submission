from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import requests
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)  # Apply CORS to your Flask app

# Sample data with updated and public Google Drive links
data = [
    {'season': 'winter', 'occasion': 'casual', 'category': 'top', 'image_url': 'https://drive.google.com/file/d/1QFKFcUPD3wKu15c_230WHkOGdvrvHy9_/view?usp=sharing'},
    {'season': 'summer', 'occasion': 'ca', 'category': 'top', 'image_url': 'https://drive.google.com/file/d/1Q45BzQkd4FLlaUMi8DGxG_BrqthDywgI/view?usp=drive_link'},
    {'season': 'summer', 'occasion': 'work', 'category': 'top', 'image_url': 'https://drive.google.com/file/d/1q_l5Qbi1ykBli1GZrHUmAKBL-hKXKhdd/view?usp=sharing'},
    {'season': 'summer', 'occasion': 'casual', 'category': 'top', 'image_url': 'https://drive.google.com/file/d/1Apay2aw_YkhiCYlF_yOQ9Mn1MocOUprA/view?usp=sharing'},
    {'season': 'summer', 'occasion': 'party', 'category': 'bottom', 'image_url': 'https://drive.google.com/file/d/1ZYKa4qkXzUYOz9KpGNxwKa_BGjmv2713/view?usp=sharing'},
    {'season': 'summer', 'occasion': 'ca', 'category': 'bottom', 'image_url': 'https://drive.google.com/file/d/1FXFdaaKke5V0n0jsQJ8v0mGTO9qOpLKN/view?usp=drive_link'},
    {'season': 'summer', 'occasion': 'casual', 'category': 'bottom', 'image_url': 'https://drive.google.com/file/d/1eJ6OwXkfRNHDeuTMP7ohBPQfRNtr6wcC/view?usp=sharing'},
    {'season': 'summer', 'occasion': 'work', 'category': 'bottom', 'image_url': 'https://drive.google.com/file/d/1cm48Px7qbh-_x0bdoy3cVr6fAE16-Q4z/view?usp=drive_link'}
]


def convert_to_direct_link(drive_link):
    # Extract the file ID from Google Drive link
    file_id = drive_link.split('/d/')[1].split('/')[0]
    direct_link = f'https://drive.google.com/uc?export=download&id={file_id}'
    return direct_link

def recommend_images(data, season, occasion, category):
    # Filter the data based on user inputs
    filtered_data = [item for item in data if season == item['season'] and
                     occasion == item['occasion'] and category == item['category']]

    # Get the image URLs
    recommended_image_urls = [item['image_url'] for item in filtered_data]

    # Load images using their URLs
    recommended_images = []
    for img_url in recommended_image_urls:
        direct_link = convert_to_direct_link(img_url)
        response = requests.get(direct_link)

        # Check if the request was successful
        if response.status_code == 200:
            try:
                img = Image.open(BytesIO(response.content))
                img_base64 = base64.b64encode(response.content).decode('utf-8')
                recommended_images.append(img_base64)
            except Exception as e:
                print(f"Error processing image from {img_url}: {e}")
                return jsonify({'error': f"Error processing image from {img_url}: {e}"}), 500
        else:
            print(f"Warning: Failed to download image from {img_url}")
            return jsonify({'error': f"Failed to download image from {img_url}"}), 404

    return recommended_image_urls, recommended_images

@app.route('/recommend', methods=['GET'])
def recommend_endpoint():
    try:
        # Get query parameters from the request URL
        season = request.args.get('season')
        occasion = request.args.get('occasion')
        category = request.args.get('category')

        # Call the recommendation function
        recommended_image_urls, recommended_images = recommend_images(data, season, occasion, category)

        return jsonify({'image_urls': recommended_image_urls, 'images_base64': recommended_images})

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
