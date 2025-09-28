import { db } from "./firebase";  //load from firebase.js in the same directory

import { collection, getDocs, query, where, documentId } from "firebase/firestore";

export async function getSortedPostsData() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

     // Sort the array of posts alphabetically by title using locale-aware string comparison
    jsonObj.sort(function(a,b) {
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

export async function getAllPostIds() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id }));

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

export async function getPostData(id) {
    const myCollectionRef = collection(db, "posts");
    const searchQuery = query(
        myCollectionRef,
        where(
            documentId(), "==", id)
    );
    const querySnapshot = await getDocs(searchQuery);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (jsonObj.length === 0) {
        return {
            id: id,
            title: 'Not found',
            date: '',
            contentHtml: 'Not found' }
    } else {
        return jsonObj[0];
    }

}