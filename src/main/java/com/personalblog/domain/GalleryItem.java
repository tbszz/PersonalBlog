package com.personalblog.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("gallery_item")
public class GalleryItem {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    private String type; // "image", "video"
    private String url;
    private String thumbnailUrl;
    private String description;
    
    // Dimensions are crucial for Masonry layout to prevent CLS (Cumulative Layout Shift)
    private Integer width;
    private Integer height;
    
    private LocalDateTime createdAt;
    
    public enum Type {
        IMAGE("image"),
        VIDEO("video");
        
        private final String value;
        
        Type(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
