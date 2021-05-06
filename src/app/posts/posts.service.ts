import { Injectable, } from '@angular/core'; //rgx is observable
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  //ref type so point to this object
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  constructor(private http: HttpClient, private router: Router) { }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  updatePost(post: Post, image?: File | string) {
    console.log('from service', post)
    let postData: Post | FormData;
    if(typeof image === 'object') {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: image
      }

    }
    this.http.put('http://localhost:3000/api/posts/'+ post.id, postData)
    .subscribe((response) => {
      //fancy update
      // // const updatedPosts = [...this.posts];
      // // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      // // post.imagePath = 'response.imagePath';
      // // updatedPosts[oldPostIndex] = post;
      // // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);


      this.router.navigate(["/"]);
      // const updatedPosts = this.posts.filter(x=> x.id !== id);
      // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);
   })
  }

  getPosts(postsPerPage: number, currentPage: Number) {
    // return [...this.posts]; ///dont want it to mutable
    //get formats
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    ///pipe is method open to observables
    .pipe(map((x) => {
      return {posts: x.posts.map(post =>{
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      }), maxPosts: x.maxPosts}
    }))
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: data.maxPosts});//object emitting event
      });
  }

  deletePost(id) {
    return this.http.delete<{message: string}>('http://localhost:3000/api/posts/'+ id)
      // .subscribe(() => {
      //    const updatedPosts = this.posts.filter(x=> x.id !== id);
      //    this.posts = updatedPosts;
      //    this.postsUpdated.next({[...this.posts]});
      // })
      // will subscribe in component
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post, image: File) {
    //<{...return type...}>
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    if (image) {
      postData.append("image", image, post.title);
    }
    this.http
      .post<{ message: string, post: Post }>(
      'http://localhost:3000/api/posts', postData
      )
      .subscribe((response) => {
        // this.posts.push(post);
        //optimistic updating
        // this.postsUpdated.next([...this.posts]);
        //coz e navigating dont need to the above
        this.router.navigate(["/"]);

      });

      //non optimistic updating
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }
}
