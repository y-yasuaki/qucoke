import {MyRequest} from "../commons/request";
import {TopicInfo} from "../../../../server/share/Interfaces";
import {timeago} from "../../../../server/share/util";
import * as Handlebars from "handlebars";
import dateFormat = require('dateformat');
class TopicsApp {
	public static start() {
		Handlebars.registerHelper("myDateFormat", (date: Date) => {
			return dateFormat(date, "yyyy/mm/dd HH:MM");
		});
		Handlebars.registerHelper("timeago", (date: Date) => {
			return timeago(date);
		});
		new ListComponent(<HTMLElement> document.querySelector(".single-page-container")).init();
	}
}



class ListComponent {
	private static LIST_TEMPL = Handlebars.compile(`
	<ul class="topics-ul">
		{{#each topics}}
			<li class="topics-li">
				<div class="left-parts">
					<div class="post-date">{{timeago postDate}} に投稿</div>
					<a class="title" href="/topic/{{_id}}">{{title}}</a>
					<div class="tags">
						{{#each tags}}
							<div class="tag">{{this}}</div>
						{{/each }}
					</div>
				</div>
				<div class="right-parts">
					<div class="view-count">
						<i class="material-icons">remove_red_eye</i>
						{{viewCount}}
					</div>
					<div class="comment-count">
						<i class="material-icons">chat_bubble_outline</i>
						{{commentCount}}
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
	`);
	constructor(private $container: HTMLElement) {}

	public init() {
		const isMyself = document.querySelector("meta[name=myself]");
		const query = !isMyself ? [] : [{
			key: "myself",
			value: true
		}];
		MyRequest.rest<TopicInfo[]>({method: "GET", path: "/api/topics", query: query}).then((topics) => {
			this.$container.innerHTML = ListComponent.LIST_TEMPL({topics: topics});
		});
	}
}
TopicsApp.start();