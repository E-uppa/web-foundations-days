# Day 8 Reflection

One of the most challenging concepts I learned was preventing double-booking during a high-demand ticket sale. I initially understood that many users accessing a system simultaneously could overload it, but I needed to understand how the system could ensure that two users did not successfully reserve the same seat. I learned that the database must be the authoritative source of ticket availability and that atomic updates or transactions can prevent conflicting reservations.

The TicketHub assignment helped me connect system design concepts such as scalability, caching, load balancing, waiting rooms and database consistency. I also learned that a cache improves read performance but should not make the final decision about whether a seat can be booked. A waiting room helps manage traffic, but database capacity and query performance still need to be monitored.

For my QuickNotes capstone, I would improve the system by reviewing its architecture, identifying possible performance bottlenecks and considering how it would handle more users. I would also test important user actions and make sure the application handles errors clearly.

My next step is to continue practising system design by learning more about database transactions, caching strategies and scaling application servers. I want to become more confident in explaining design decisions and the trade-offs involved.
