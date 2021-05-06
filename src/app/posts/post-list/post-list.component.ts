import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular//material/paginator';
// if component is not in dom kill subscriptions otherwise there will be memory leaks
import { Subscription } from "rxjs";
import { PostsService } from '../posts.service';
import { Post } from './../post.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;//what page are we on
  currentPage = 1;//what page are we on
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, 1);
    this.isLoading = true;
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts
        this.totalPosts = postData.postCount
      })
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id) {
    console.log("delete", id)
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() =>{
      if (this.totalPosts - 1 === this.postsPerPage * (this.currentPage - 1)) {
        this.currentPage = 1;
    }
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    })
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
