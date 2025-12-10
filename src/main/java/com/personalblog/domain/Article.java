package com.personalblog.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("blog_article")
public class Article {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    private String title;
    private String content;
    private String summary;
    private String coverImage;
    
    private String status;
    private LocalDateTime publishTime;
    private LocalDateTime scheduledPublishTime;
    private Boolean scheduleEnabled;
    
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    
    private Long authorId;
    private String authorName;
    
    private Boolean isTop;
    private Boolean isRecommend;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum Status {
        DRAFT("draft"),
        PUBLISHED("published"),
        SCHEDULED("scheduled");
        
        private final String value;
        
        Status(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}