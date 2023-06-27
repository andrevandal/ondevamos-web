Database Entities:

1. Place
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Name: Name of the place
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the place
   - Rating Level: Average rating of the place (0-5, in steps of 0.5)
   - Rating Count: Number of ratings submitted for the place
   - Pricing Level: The pricing level of the place (1-4, with 1 = low, 2 = medium, 3 = high, 4 = very high)
   - Pricing Level Count: Number of pricing level categories within the application
   - Cover Media ID: Foreign key referring to the cover media in the Media table
   - Avatar Media ID: Foreign key referring to the avatar media in the Media table
   - Created At: Timestamp when the place was created
   - Updated At: Timestamp when the place was last updated
   - Address ID: Foreign key referring to the address in the Address table

2. Category
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Name: Name of the category
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the category
   - Icon: JSON including icon name and icon label
   - Created At: Timestamp when the category was created
   - Updated At: Timestamp when the category was last updated

3. Tag
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the tag
   - Icon: JSON including icon name and icon label
   - Created At: Timestamp when the flag was created
   - Updated At: Timestamp when the flag was last updated

4. Media
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Type: Type of media, either "image" or "video"
   - Title: Title of the media item
   - Description: Short description of the media item
   - Alternative Text: Textual description used for accessibility purposes
   - URL: URL where the media is stored
   - Created At: Timestamp when the media was created
   - Updated At: Timestamp when the media was last updated

5. Action
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Title: Title of the action
   - Link: URL or link associated with the action
   - Icon Name: (optional) Icon name representing the action
   - Created At: Timestamp when the action was created
   - Updated At: Timestamp when the action was last updated

6. Attraction
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Title: Title of the attraction
   - Description: Description of the attraction
   - Media ID: (optional) Foreign key referencing the related media in the Media table using ID
   - Is Featured: Boolean value indicating whether the attraction is featured
   - Created At: Timestamp when the attraction was created
   - Updated At: Timestamp when the attraction was last updated

7. Opening Hour
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Day of Week: Numeric representation of the day of the week (0-6; e.g., 0 = Sunday, 1 = Monday)
   - Open Time: Time when the place opens
   - Close Time: Time when the place closes
   - Created At: Timestamp when the opening hour was created
   - Updated At: Timestamp when the opening hour was last updated

8. Special Opening Hour
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Description: Description of the holiday or special event
   - Date: Date of the holiday or special event
   - Open Time: Time when the place opens
   - Close Time: Time when the place closes
   - Created At: Timestamp when the special opening hour was created
   - Updated At: Timestamp when the special opening hour was last updated

9. Address
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Street: Street name of the place's address
   - Number: Building number of the place's address
   - Complement: Additional information about the address (e.g., apartment number)
   - Neighborhood: Neighborhood of the place's address
   - City ID: Foreign key referring to the place's city in the City table
   - Latitude: Latitude coordinate of the city's location
   - Longitude: Longitude coordinate of the city's location

10. City
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Public ID: Unique Nano ID (12 characters long) for API
   - Name: Name of the city
   - State: State or province of the city
   - Country: Country of the city
   - Latitude: Latitude coordinate of the city's location
   - Longitude: Longitude coordinate of the city's location
   - Created At: Timestamp when the city was created
   - Updated At: Timestamp when the city was last updated

11. PlaceCategory (Mapping Table)
    - Place ID: Foreign key referencing the Place table using ID
    - Category ID: Foreign key referencing the Category table using ID
  
12. PlaceTag (Mapping Table)
    - Place ID: Foreign key referencing the Place table using ID
    - Tag ID: Foreign key referencing the Tag table using ID

Entities Relations:

1. Place and Media (Cover Media and Avatar Media) (One-to-One)
   - One Place has one cover media
   - One Place has one avatar media
  
2. Place and City (Many-to-One)
   - One Place is located in one City
   - One City can have many Places

3. Place and Action (One-to-Many)
   - One Place can have multiple Actions
   - One Action is related to one Place

4. Place and Attraction (One-to-Many)
   - One Place can have multiple Attractions
   - One Attraction is related to one Place

5. Attraction and Media (Many-to-One)
   - One Attraction can have one related Media item
   - One Media item can be related to multiple Attractions (if the same media is used for different attractions)

6. Place and Opening Hour (One-to-Many)
   - One Place can have multiple Opening Hours (one per day of the week)
   - One Opening Hour is related to one Place

7. Place and Special Opening Hour (One-to-Many)
   - One Place can have multiple Special Opening Hours (for holidays or special events)
   - One Special Opening Hour is related to one Place 

8. Place and Category (Many-to-Many)
   - One Place can have multiple Categories
   - One Category can be assigned to multiple Places

9. Place and Tag (Many-to-Many)
   - One Place can have multiple Tags
   - One Tag can be assigned to multiple Places