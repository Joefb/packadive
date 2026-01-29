# PackaDive App

## Main App idea

When packing and planning for a dive trip there is a lot of work involved.
All dive gear must be checked. All batteries charged. Dive computers charged, etc.
Each piece of gear must be in proper working order. And the most important part
is not to forget a piece of gear!! There have been many dives where something
was forgotten. Could be something small like 2 lb weight, torch battery not charged, a hood,
or even something big like regulators!

On top of that there is the normal items needed for a trip. Clothes, toiletries, sleeping bag,
pillow, food, etc. A lot goes into making sure everything is packed and ready to go.
If something is forgotten it can ruin the trip or cause unneeded stress. And if the dive
site is out in the middle of nowhere it can be impossible to get a forgotten item.

How I do it now is get out a pad and paper and make three lists. Diving, Camping, and Need.
When a piece of equipment is checked and ready for a dive I give it a check mark. When the piece of equipment
is actually in the car and packed I cross it off. Same for the Camping list. The Need list is for
items that need to be purchased or acquired before the trip. When I get the item it gets a check mark,
and when packed in the car it gets crossed off.

When making the lists I often forget items that should be on the list! So
extra time is spent making sure everything is there.

PackaDive will help solve these issues!

## User Story

First off the UI will be clean,simple and easy to use.

- When the user enters the page they will be greeted with a hero page
  that is diving themed.
- There will be a login and sign up button on the hero page.
- When logged in, the user will see all three lists.
- Each item on the list can be tapped/clicked to toggle between three states:
  - Not Ready (default)
  - Ready (checked)
  - Packed (crossed off)
- The navbar will:
  - have a button to open a modal to manage the lists
  - display if the user is logged in
  - logout button
  - Search bar to check the weather of the dive site
- The session will persist and data saved into a database
- The app must be mobile friendly for when the user is on the go.

## 3rd Party API

A 3rd party weather API will be used to get the weather of the dive site.
The API of my database will be used as well.
