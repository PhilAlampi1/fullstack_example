# Fullstack Example
Example fullstack web application written in Meteor.js. See www.bpofusion.com for a real-world running instance.

# Project Purpose
This is a waitlist landing page for new startup ideas and new products. It was inspired by Harry's prelaunch campaign, which generated over 100,000 signups in one week! Read more about it here: http://tim.blog/2014/07/21/harrys-prelaunchr-email/. 

Since most of us are making software, not physcial products we can give away, this implementation is a little different from Harry's launch. This landing page incents people to share the news through email and social media sites by offering $15 cash for each successful referral (read: people that become paying customers after launch) and a $15 product credit to each new customer. This way everyone gets something from the interaction and all parties are incented to keep sharing. Keep in mind the web app can be configured for any incentive, it doesn't have to be the one currently shown.

# Getting Started
First make sure you have Meteor installed locally. If not, see here to do the deed: https://www.meteor.com/install

Clone or download this repo to your local machine. Navigate to the fullstack_example directory in command line and enter: meteor run --settings settings-dev.json. After Meteor starts up, you can view the app at http://localhost:3000/ in your browser. I highly recommend using Dr. Mongo or a similar tool to gain transparancy into your Mongo DB: https://github.com/DrMongo/DrMongo. You'll need it for tweaking the data as you play with the app (e.g. changing the IP address recorded for a new sign-ups in the database so you can submit more sign-ups from the same IP, same with email addresses, etc.).

# Key Features
1 - Social Proof -
The main landing page has an area for beta user testimonials. Assuming you are close to product-market fit with your beta users, this area can be used to show off how your work so far has helped them.

2 - Unique Link and Email on Sign-Up - 
For each person that signs up, the web app generates a unique link they can share with their friends. They also receive a welcome email thanking them and reinforcing the message to share with their friends for cash incentives. When a new contact signs up using their friend's link, their friend is recorded as their referrer. 

3 - Email Notifications From Cron Job - 
Each morning, a cron job runs looking for new referrals. If found, the referrers will receive an email notifying them that their friends have signed up, how many and which of their friends in total have signed up and a reminder to keep sharing. This communication is designed to encourage them to keep sharing as they continue to have success through the program.

4 - Reporting From Cron Job -
The cron job also aggregates counts of all sign-ups to date, how many have become referrers, who the top referrers are and how many referrals each of them has made.

# Enhancement Ideas
1 - Support for Video -
In order for this type of landing page to truly "go viral", we need to ensure its conversion rate is optimized. Since videos have been shown to increase conversion rates by 86%, adding video support to the page seems like a logical next step (see http://boast.io/20-statistics-about-using-testimonials-in-marketing/). This would be easy to do from a technical standpoint, but creating the actual video at high-quality would be a far more involved undertaking.

2 - Countdown to Launch - 
Adding a counter until launch (if known) could add urgency to the call to action and help convert passive traffic into sign-ups.
