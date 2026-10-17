# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

The plan uses the following assumptions:

- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each uploaded photo also has one thumbnail of 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- Average request rates are calculated by spreading daily activity evenly across 24 hours.
- Peak feed traffic is estimated at five times the average feed-view rate.
- Storage estimates use decimal units: 1,000 KB = 1 MB, 1,000 MB = 1 GB, and 1,000 GB = 1 TB.
- The storage estimate assumes every uploaded photo and thumbnail is retained for a year, with no deletions. It excludes backups, replicas, and other application data.
- Feed views are counted as page requests, not individual image requests. One feed page may request several images.

## 2. Traffic and Storage Estimates

### Daily Active Users

Daily active users = Registered users × Daily active percentage

10,000,000 × 10% = 1,000,000 daily active users.

### Photo Uploads per Second

Each daily active user uploads one photo per day.

Daily uploads = 1,000,000 × 1 = 1,000,000 photos per day.

Average uploads per second = 1,000,000 ÷ 86,400 = 11.57.

SnapShare should therefore handle approximately 12 photo uploads per second on average. Actual traffic may be higher during busy periods.

### Feed Views per Second

Each daily active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50 = 50,000,000 feed views per day.

Average feed views per second = 50,000,000 ÷ 86,400 = 578.7.

Average feed traffic is approximately 579 views per second.

Peak feed views per second = 578.7 × 5 = 2,893.5.

Peak feed traffic is approximately 2,894 views per second.

### Photo Storage per Year

Each original photo is 2 MB.

Daily original-photo storage = 1,000,000 × 2 MB = 2,000,000 MB, or 2 TB per day.

Annual original-photo storage = 2 TB × 365 = 730 TB per year.

Each thumbnail is 50 KB.

Daily thumbnail storage = 1,000,000 × 50 KB = 50,000,000 KB, or 50 GB per day.

Annual thumbnail storage = 50 GB × 365 = 18.25 TB per year.

Total annual storage for original photos and thumbnails = 730 TB + 18.25 TB = 748.25 TB.

SnapShare therefore needs approximately 748.25 TB of additional object storage capacity per year for original photos and thumbnails, before accounting for backups, replicas, deletions, or other data.

## 3. Read-Heavy or Write-Heavy?

SnapShare is read-heavy because users view 50 million feed pages per day but upload 1 million photos per day. Feed views occur about 50 times as often as photo uploads.

This means the architecture should be designed to serve frequent feed requests efficiently. Caching, a CDN, load balancing, and database read replicas can reduce repeated work and distribute the reading workload. Photo uploads must also remain reliable, but they happen less frequently than feed views.

## 4. Why Store Photos in Object Storage?

The relational database should store structured information about each photo, such as its ID, owner, caption, upload time, processing status, and storage location. The actual photo files should be stored in object storage.

Object storage is designed to store and retrieve large files at scale. Keeping large photo files outside the relational database helps avoid unnecessary database growth and reduces the amount of file data that must be handled during database backups and queries. The database stores references to the files rather than the full image contents.

A CDN can then cache and deliver photos and thumbnails to users from locations closer to them.

## 5. Architecture Diagram

```text
                         +----------------------+
                         |    Users / Clients   |
                         +----------+-----------+
                                    |
                       +------------+------------+
                       |                         |
                 Feed/image requests       Photo upload
                       |                         |
                       v                         v
                 +-----------+             +-----------+
                 |    CDN    |             |   CDN or  |
                 | (cached   |             |  Upload   |
                 |  images)  |             |  endpoint |
                 +-----+-----+             +-----+-----+
                       |                         |
                       | cache miss / API        | application API
                       | requests                |
                       v                         v
                 +-----------------------------------+
                 |           Load Balancer           |
                 +----------------+------------------+
                                  |
                     +------------+------------+
                     |            |            |
                     v            v            v
                +---------+  +---------+  +---------+
                | App     |  | App     |  | App     |
                | Server 1|  | Server 2|  | Server 3|
                +----+----+  +----+----+  +----+----+
                     |            |            |
                     +------------+------------+
                                  |
                +-----------------+-----------------+
                |                 |                 |
                v                 v                 v
          +-----------+   +---------------+   +-------------+
          | Cache     |   | Primary       |   | Object      |
          | (feed data|   | Database      |   | Storage     |
          | and hot   |   | (photo        |   | (original   |
          | metadata) |   | metadata)     |   | photos and  |
          +-----------+   +-------+-------+   | thumbnails) |
                                  |           +------+------+
                                  v                  ^
                         +----------------+          |
                         | Read Replica   |          |
                         | (read queries) |          |
                         +----------------+          |
                                                     |
                 +----------------+                  |
                 | Message Queue  |                  |
                 | (thumbnail job)|                  |
                 +-------+--------+                  |
                         |                           |
                         v                           |
                 +----------------+                  |
                 | Thumbnail      |------------------+
                 | Worker         | stores thumbnail
                 +----------------+
```

The CDN serves cached image files directly when possible. Requests that require application logic go through the load balancer to an available application server. Application servers use the cache and database for feed information, while object storage holds the actual image files.

## 6. What Each Component Does

- **Users / Clients:** Users upload photos and request feeds through the web or mobile application.
- **CDN:** Caches and delivers photos and thumbnails from locations closer to users, reducing image-loading delays and requests to the origin storage.
- **Load balancer:** Distributes application requests across healthy application servers so that one server does not have to handle all the traffic.
- **Application servers:** Handle application logic, authenticate users, authorize access, coordinate uploads, retrieve feed data, and communicate with other components.
- **Cache:** Keeps frequently requested feed results or metadata available for faster retrieval, reducing repeated database queries.
- **Primary database:** Stores authoritative structured data, including users, photo metadata, relationships, captions, and photo storage locations.
- **Read replica:** Serves eligible read queries to reduce the workload on the primary database; its data may briefly lag behind the primary.
- **Object storage:** Stores the original photo files and generated thumbnails independently of the relational database.
- **Message queue:** Holds thumbnail-generation jobs so that they can be processed asynchronously rather than delaying the upload request.
- **Thumbnail worker:** Retrieves jobs from the queue, generates smaller versions of photos, and saves the thumbnails in object storage.

## 7. Step-by-Step Photo Upload Flow

1. A user signs in and selects a photo to upload.
2. The application client sends an upload request to the application API through the load balancer. An application server authenticates the user and checks that the user is allowed to upload.
3. The application server creates or prepares the photo record in the primary database and provides a secure, time-limited upload URL for object storage. The record can initially have a status such as "processing".
4. The client uploads the original photo directly to object storage using the authorized upload URL. This avoids routing the entire large file through an application server.
5. After the upload succeeds, the application confirms the upload and records or updates the photo's storage location and status in the primary database.
6. The application places a thumbnail-generation job on the message queue.
7. A thumbnail worker picks up the job, retrieves the original photo from object storage, and generates a 50 KB thumbnail or an appropriately sized thumbnail near that target.
8. The worker saves the thumbnail in object storage and updates the photo metadata or processing status in the database.
9. When a user views the photo in a feed, the application retrieves the required feed metadata from the cache or a suitable database, and the image is served through the CDN when cached or fetched from object storage when needed.

If a thumbnail job fails, it should be retried safely or recorded for investigation. The system should also avoid exposing private photos through publicly accessible storage URLs.

## 8. Trade-Offs

### Trade-Off 1: Caching vs. Freshness

Caching feed data reduces database queries and can improve response times. However, cached information may become outdated when a user uploads a new photo or changes their account. SnapShare must choose suitable cache expiration periods or invalidate affected entries when data changes.

### Trade-Off 2: Read Replicas vs. Immediate Consistency

Read replicas distribute read queries and reduce pressure on the primary database. However, replication can take time, so a newly uploaded photo may not appear immediately if a feed request reads from a replica. The application can use the primary for reads that require the latest data and replicas for less time-sensitive queries.

### Trade-Off 3: Asynchronous Thumbnail Generation vs. Immediate Availability

A queue allows the application to acknowledge an upload without waiting for the thumbnail worker to finish, improving responsiveness. However, the thumbnail may not be ready immediately. SnapShare should show a processing state or temporarily use the original image until the thumbnail is available.

### Trade-Off 4: CDN Performance vs. Cache Management

A CDN reduces image-loading delays and traffic to object storage. However, cached images may remain available after an image is changed or deleted unless the cache is updated or invalidated. SnapShare needs appropriate cache rules and access controls, especially for private photos.

## 9. Conclusion

SnapShare is expected to serve one million daily active users, handle approximately 12 uploads per second on average, and support around 579 average feed views per second with an estimated peak of 2,894. It will add approximately 748.25 TB of original-photo and thumbnail data each year under the stated assumptions.

Because feed views greatly outnumber uploads, the system is read-heavy. A CDN, cache, load balancer, multiple application servers, and database read replica help handle that reading workload. Object storage holds image files, while a message queue and thumbnail worker handle image processing asynchronously. These choices improve scalability but introduce trade-offs involving freshness, consistency, cache management, and background-job processing.
