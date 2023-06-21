1. Place
  - placeId: Unique identifier for a place
  - name: Name of the place
  - slug: Unique URL-friendly identifier used for SEO purposes
  - description: Short description of the place
  - ratingLevel: Average rating of the place (0-5, in steps of 0.5)
  - ratingCount: Number of ratings submitted for the place
  - pricingLevel: The pricing level of the place (e.g., 1-4, with 1 = low, 2 = medium, 3 = high, 4 = very high)
  - pricingLevelCount: Number of pricing level categories within the application
  - addressId: Foreign key referring to the Address table
  - coverMediaId: Foreign key referring to the cover media in the Media table
  - avatarMediaId: Foreign key referring to the avatar media in the Media table
  - createdAt: Timestamp when the place was created
  - updatedAt: Timestamp when the place was last updated
  - 
2. Category
  - categoryId: Unique identifier for a category
  - name: Name of the category
  - slug: Unique URL-friendly identifier used for SEO purposes
  - description: Short description of the category
  - iconName: Icon name representing the category
  - createdAt: Timestamp when the category was created
  - updatedAt: Timestamp when the category was last updated

3. Tag
  - tagId: Unique identifier for a tag
  - name: Name of the tag
  - slug: Unique URL-friendly identifier used for SEO purposes
  - description: Short description of the tag
  - iconName: Icon name representing the category
  - createdAt: Timestamp when the flag was created
  - updatedAt: Timestamp when the tag was last updated

4. Media
  - mediaId: Unique identifier for media item
  - type: Type of media, either "image" or "video"
  - title: Title of the media item
  - description: Short description of the media item
  - alternativeText: Textual description used for accessibility purposes
  - url: URL where the media is stored
  - createdAt: Timestamp when the media was created
  - updatedAt: Timestamp when the media was last updated

5. Action
  - actionId: Unique identifier for an action
  - placeId: Foreign key referring to the Place table
  - title: Title of the action
  - link: URL or link associated with the action
  - iconName: (optional) Icon name representing the action
  - createdAt: Timestamp when the action was created
  - updatedAt: Timestamp when the action was last updated

6. Attraction
  - attractionId: Unique identifier for an attraction
  - placeId: Foreign key referring to the Place table
  - title: Title of the attraction
  - description: Description of the attraction
  - mediaId: (optional) Foreign key referring to the related media in the Media table
  - isFeatured: Boolean indicating if the attraction is featured
  - createdAt: Timestamp when the attraction was created
  - updatedAt: Timestamp when the attraction was last updated

7. OpeningHour
  - openingHourId: Unique identifier for an opening hour
  - placeId: Foreign key referring to the Place table
  - dayOfWeek: Day of the week (e.g., Monday, Tuesday)
  - openTime: Time when the place opens
  - closeTime: Time when the place closes
  - createdAt: Timestamp when the opening hour was created
  - updatedAt: Timestamp when the opening hour was last updated

8. Address
  - addressId: Unique identifier for an address
  - street: Street name of the place's address
  - number: Building number of the place's address
  - complement: Additional information about the address (e.g., apartment number)
  - neighborhood: Neighborhood of the place's address
  - city: City of the place's address
  - state: State or province of the place's address
  - country: Country of the place's address
  - zipCode: Postal code of the place's address
  - latitude: Latitude coordinate of the place's location
  - longitude: Longitude coordinate of the place's location
  - createdAt: Timestamp when the address was created
  - updatedAt: Timestamp when the address was last updated