BrainsterProjects_MarioMinchevskiFE14

# Challange Notes

**Viewport size: 414px x  896px**

DPR: 1.50

_____________

## Description

### General notes

- For this project, since it was css heavy, I decided to go with SASS for the styling to have maximum freedom and accuracy when it comes to replicating the figma design. PLEASE bare in mind that as mentioned in the mentorship, this should be a mobile only app(for now). I have added some responsivity for mobile S (until 330px) and mobile L until (~500px). The design is almost pixel perfect for 414px, as the Figma file dimesions.

- I have left a lot of comments throughout the JS files explaning the process, so I will skip mentioning some of the steps and why I took them here in the readme file.

### Extra features

I've added a lot of extra features which explain the code being bigger for some pages. I left plenty of comments so it's pretty straightforward and easy to understand

##### Landing page

- Custom dropdown selection arrow, that rotates on click

##### Visitor Listing Page

- Reset button on the filters pop up. That way the "X" or "Close" button will just close the pop up and leave the filtered(if any) items as they were. The reset button will show all the published listed items.
- Custom error message pop up if the filters don't match the search. It can take you to the listing or to the filters pop up again.
- Custom animation for the filters pop up button

##### Visitor Home Page

- A bit different header design for mobile S screen size

##### Artist Home Page

- Extra button/link in the hamburger menu. "Log out" will basically take you to the landing page and it does the same thing if you click on the header/nav logo. This gives a more proper feel in terms of UX/UI.

- Current bid box. I've added one line of text, describing which item from what artist is auctioning. This way, if you start an auction with artist A, log out, log in as artist B, you will know which item and for how much is bidding, not to get confused. If the auction is live, and there no bids, it will say "no bids yet".

##### Artist Items Page

- Confirmation message box when you delete an item
- Addequate error messages for all of the inputs in the add new item pop up
- Prevent to save added/edited item if there is both url and snapshot
- Custom trashcan icon that will delete the snapshot if any. Updates the visibilty depending if there is a snapshot or not
- If an edited item image is a snapshot, the snapshot box is updated in the edit pop up instead of the url input
- Turn off cam record if you take a snapshot, visit another page or click on the back button in the snapshot selection
- Disable the auction buttons if they are sold or currently auctioning
- Custom error message if a user tries to send an item to auction when there is already a live auction

NOTE: As mentioned in the mentorship session, it was debatable if you should be directly redirected to the auction page when you sent an item to an auction. I decided not to, so the auction goes live once an artist or visitor decides to visit the page

##### Auction Page

- The time off the auction page is taken into consideration, so if you leave the page for 5s at 15s, then get back to it, the timer will say 10s 
- Three custom messages that will appear depending on the input value
- Highest bid will be updated constantly when seen as both artist and visitor
- Custom hand drawn icons for the bidding list which updated dynamically
- Custom message if a user wins at the end of the auction, that will appear if youre logged as a visitor
- Custom message if the API wins at the end of the auction, that will appear if youre logged as a visitor
- Custom message if there are no bids, and the item is not sold
- If an item is not sold, it status will not be changed and you can auction it again
 
### Git procedure

In both the brief and mentorship there was no specification if we should constantly push the code or not. I decided not to, to save time and focus on more important aspects of the project


