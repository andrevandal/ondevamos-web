# Database Entities

1. Place
   - ID: Auto-inc. key (int)
   - UUID: Unique Nano ID (12 chars)
   - Name: Place name
   - Slug: SEO-friendly identifier
   - Description: Place's short desc
   - Rating Level & Count: Avg. rating in 0.5 steps & count
   - Pricing Level & Count: Pricing level (1=low,4=high) & count
   - Cover & Avatar Media ID: FKs to Media table
   - Active: Boolean for place's activity
   - External ID: Unique ID from external sys.
   - Created At & Updated At: Timestamps
   - Address ID: FK to Address table
2. Category
   - ID & UUID: As above
   - Name: Category name
   - Slug: SEO-friendly identifier
   - Description: Category's short desc
   - Icon: Icon name & label in JSON
   - Active & Timestamps: As above
3. Tag
   - ID, UUID, Slug, Description, Icon, Active, Created At & Updated At: As above
4. Media
   - ID, UUID, Active, Created At & Updated At: As above
   - Type: Media type ("image" or "video")
   - Title: Media title
   - Description: Media's short description
   - Alternative Text: Text for accessibility
   - URL: Media storage URL
5. Action
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Title: Action title
   - Link: Linked URL
   - Icon Name: (optional) Icon name
6. Attraction
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Title: Attraction title
   - Description: Attraction's short desc
   - Media ID: (optional) FK to Media
   - Is Featured: Boolean for feature status
7. Opening Hour
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Day of Week: Numeric day of week (0-6)
   - Open & Close Time: Time slots
8. Special Opening Hour
   - ID, UUID, Place ID, Description, Open & Close Time, Created At & Updated At: As above
   - Date: Date of special event or holiday
9. Address
   - ID, UUID: As above
   - Street, Number, Complement, Neighborhood: Address info
   - City ID: FK to City
   - Latitude & Longitude: Geo coords
10. City
    - ID, UUID, Created At & Updated At: As above
    - Name: City name
    - State & Country: State & Country of the city
    - Latitude & Longitude: Geo coords

## Entities Relations

1. Place <> Media (Cover & Avatar) (1:1)
   - Each Place has 1 cover & avatar media
2. Place <> City (N:1)
   - 1 Place belongs to 1 City
   - 1 City contains many Places
3. Place <> Action (1:N)
   - 1 Place hosts many Actions
   - Each Action tied to a Place
4. Place <> Attraction (1:N)
   - 1 Place presents many Attractions
   - Each Attraction tied to a Place
5. Attraction <> Media (N:1)
   - 1 Attraction can have 1 associated Media
   - 1 Media can associate with many Attractions
6. Place <> Opening Hour (1:N)
   - 1 Place has many Opening Hours
   - Each Opening Hour tied to a Place
7. Place <> Special Opening Hour (1:N)
   - 1 Place has many Special Opening Hours
   - Each Special Opening Hour tied to a Place
8. Place <> Category (N:N)
   - 1 Place belongs to multiple Categories
   - 1 Category hosts many Places
9. Place <> Tag (N:N)
   - 1 Place holds multiple Tags
   - 1 Tag related to many Places
