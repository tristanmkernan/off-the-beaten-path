import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackendService } from '../services/backend.service';

import { ViewPost } from '../models/post.model';
import { EasyPagination } from '../models/easy-pagination.model';
import { TargetLocation } from '../models/target.model';

@Component({
    selector: 'app-postings',
    templateUrl: './postings.component.html',
    styleUrls: ['./postings.component.css', '../common.css']
})
export class PostingsComponent implements OnInit {

    public target: TargetLocation;

    public posts: ViewPost[];
    public currentPage: number;

    private _key: string;

    constructor(private backendService: BackendService,
		private route: ActivatedRoute) { }

    ngOnInit() {
	this.route
	    .params
	    .switchMap(
		params => {
		    this._key = params['key'];
		    
		    return this.backendService.getPosts(params['key']);
		}
	    )
	    .subscribe(
		success => {
		    this.posts = success.data;
		    this.currentPage = success.pageNumber;
		},
		error => {
		    console.log('PostingsComponent', error);
		}
	    );
    }

    public onScrolled() {
	this.backendService
	    .getPosts(
		this._key,
		this.currentPage + 1
	    )
	    .subscribe(
		success => {
		    this.posts = this.posts.concat(success.data);
		    this.currentPage = success.pageNumber;
		},
		error => {
		    console.log('PostingsComponent', error);
		}
	    );
    }
}
