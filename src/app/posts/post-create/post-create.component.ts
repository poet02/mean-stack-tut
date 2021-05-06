import { Component, OnInit } from '@angular/core';
import { Post } from './../post.model';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { mimeType } from "./../../validators/mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private  mode = 'çreate';
  private postId: string;
  private imgPreview: string;
  loadedPost: Post;
  isLoading: boolean = false;
  form: FormGroup;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      //intial state, validators or form control, updateOn
      title: new FormControl(null, {
        validators:
          [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators:
          [Validators.required]
      }),
      image: new FormControl(null, {
        validators:[],
        asyncValidators: [mimeType]
      })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(data => {
          this.isLoading = false;
          this.loadedPost = {
            id: data._id,
            title: data.title,
            content: data.content,
            // imagePath: data.imagePath

            };
            this.form.setValue({
              'title': this.loadedPost.title,
              'content': this.loadedPost.content,
              'image': this.loadedPost.imagePath? this.loadedPost.imagePath : null
            })
            console.log(this.loadedPost)
        });
        // console.log("madarrrrraaa", this.loadedPost);
        // this.form.setValue({
        //   'title': this.loadedPost.title,
        //   'content': this.loadedPost.content
        // })
        //
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  OnImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    }

    reader.readAsDataURL(file);

  }

  onSavePost()
  {
      //console.dir will return html properties
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    let post: Post = {
      id: "",
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image
    }
    console.log('fromForm', this.form.value)
    if (this.mode === 'create') {
      this.postsService.addPost(post, this.form.value.image);
    } else {
      post.id = this.loadedPost.id;
      this.postsService.updatePost(post, this.form.value.image);
    }

    this.form.reset();
  }

}
