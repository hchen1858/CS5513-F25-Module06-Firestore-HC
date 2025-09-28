// Import the Firebase database instance from the local firebase.js configuration file
import { db } from "./firebase";  //load from firebase.js in the same directory

// Import specific Firestore functions needed for database operations
import { collection, getDocs, query, where, documentId } from "firebase/firestore";

// Function to retrieve all posts from Firestore, sort them alphabetically by title, and return formatted data
export async function getSortedPostsData() {
    // Create a reference to the "posts" collection in the Firestore database
    const myCollectionRef = collection(db, "posts");
    // Execute a query to fetch all documents from the posts collection
    const querySnapshot = await getDocs(myCollectionRef);
    // Transform the query results into an array of objects, combining document ID with document data
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

     // Sort the array of posts alphabetically by title using locale-aware string comparison
    jsonObj.sort(function(a,b) {
        // Use localeCompare for proper alphabetical sorting that handles special characters
        return a.title.localeCompare(b.title);
    });
    // Transform each post object to ensure id is a string and return the modified array
    return jsonObj.map(item => {
        return {
            // Convert the id to a string to ensure consistent data type
            id: item.id.toString(),
            // Include the post title
            title: item.title,
            // Include the post date
            date:item.date,
            // Include the path to the post's image
            imagePath: item.imagePath,
            // Include the alt text for the post's image
            altText: item.altText,
            // Include the HTML content of the post
            contentHtml: item.contentHtml
        }
    });
}

// Function to retrieve all post IDs from Firestore for dynamic routing purposes
export async function getAllPostIds() {
    // Create a reference to the "posts" collection in the Firestore database
    const myCollectionRef = collection(db, "posts");
    // Execute a query to fetch all documents from the posts collection
    const querySnapshot = await getDocs(myCollectionRef);
    // Transform the query results into an array of objects containing only the document IDs
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id }));

    // Transform each post ID into the format required by Next.js dynamic routing
    return jsonObj.map(item => {
        return {
            // Create a params object containing the post ID
            params: {
                // Convert the id to a string and assign it to the id parameter
                id: item.id.toString()
            }
        }
    });
}

// Function to retrieve a specific post by its ID from Firestore
export async function getPostData(id) {
    // Create a reference to the "posts" collection in the Firestore database
    const myCollectionRef = collection(db, "posts");
    // Create a query to search for a document with the specific ID
    const searchQuery = query(
        myCollectionRef,
        // Use documentId() function to query by document ID and match it with the provided id parameter
        where(
            documentId(), "==", id)
    );
    // Execute the query to fetch the document with the matching ID
    const querySnapshot = await getDocs(searchQuery);
    // Transform the query results into an array of objects, combining document ID with document data
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Check if no document was found with the specified ID
    if (jsonObj.length === 0) {
        // Return a default "Not found" object if no post exists with the given ID
        return {
            id: id,
            title: 'Not found',
            date: '',
            contentHtml: 'Not found' }
    } else {
        // Return the first (and should be only) document found with the matching ID
        return jsonObj[0];
    }

}