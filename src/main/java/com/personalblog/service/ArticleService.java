package com.personalblog.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.personalblog.domain.Article;
import com.personalblog.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class ArticleService extends ServiceImpl<ArticleMapper, Article> {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String ARTICLE_LIKE_KEY_PREFIX = "article:like:";
    private static final String ARTICLE_VIEW_KEY_PREFIX = "article:view:";
    private static final String DIRTY_VIEW_ARTICLES_KEY = "article:dirty:view";
    private static final String DIRTY_LIKE_ARTICLES_KEY = "article:dirty:like";
    
    public Page<Article> getPublishedArticles(int page, int size) {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", Article.Status.PUBLISHED.getValue())
                   .orderByDesc("is_top", "publish_time");
        return page(new Page<>(page, size), queryWrapper);
    }
    
    public Article getPublishedArticle(Long id) {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", id)
                   .eq("status", Article.Status.PUBLISHED.getValue());
        return getOne(queryWrapper);
    }
    
    public Article createArticle(Article article) {
        article.setViewCount(0L);
        article.setLikeCount(0L);
        article.setCommentCount(0L);
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());
        
        if (Boolean.TRUE.equals(article.getScheduleEnabled()) && article.getScheduledPublishTime() != null) {
            article.setStatus(Article.Status.SCHEDULED.getValue());
        } else if (article.getStatus() == null) {
            article.setStatus(Article.Status.DRAFT.getValue());
        }
        
        save(article);
        return article;
    }
    
    public Article updateArticle(Article article) {
        article.setUpdatedAt(LocalDateTime.now());
        updateById(article);
        return article;
    }
    
    public void publishArticle(Long id) {
        Article article = getById(id);
        if (article != null) {
            article.setStatus(Article.Status.PUBLISHED.getValue());
            article.setPublishTime(LocalDateTime.now());
            article.setScheduleEnabled(false);
            updateById(article);
        }
    }
    
    public void incrementViewCount(Long articleId) {
        try {
            String key = ARTICLE_VIEW_KEY_PREFIX + articleId;
            redisTemplate.opsForValue().increment(key);
            redisTemplate.opsForSet().add(DIRTY_VIEW_ARTICLES_KEY, articleId);
        } catch (Exception e) {
            System.err.println("Redis error in incrementViewCount: " + e.getMessage());
        }
    }
    
    public void incrementLikeCount(Long articleId) {
        try {
            String key = ARTICLE_LIKE_KEY_PREFIX + articleId;
            redisTemplate.opsForValue().increment(key);
            redisTemplate.opsForSet().add(DIRTY_LIKE_ARTICLES_KEY, articleId);
        } catch (Exception e) {
            System.err.println("Redis error in incrementLikeCount: " + e.getMessage());
        }
    }
    
    @Scheduled(fixedDelay = 60000) // Every 1 minute
    public void syncViewCountsToDatabase() {
        try {
            Set<Object> dirtyArticleIds = redisTemplate.opsForSet().members(DIRTY_VIEW_ARTICLES_KEY);
            if (CollectionUtils.isEmpty(dirtyArticleIds)) {
                return;
            }
            
            for (Object idObj : dirtyArticleIds) {
                try {
                    Long articleId = Long.valueOf(idObj.toString());
                    String key = ARTICLE_VIEW_KEY_PREFIX + articleId;
                    Object countObj = redisTemplate.opsForValue().get(key);
                    
                    if (countObj != null) {
                        Long count = Long.valueOf(countObj.toString());
                        Article article = getById(articleId);
                        if (article != null) {
                            article.setViewCount(article.getViewCount() + count);
                            updateById(article);
                            redisTemplate.delete(key);
                            redisTemplate.opsForSet().remove(DIRTY_VIEW_ARTICLES_KEY, idObj);
                        }
                    }
                } catch (Exception e) {
                    // Log error but continue
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Redis error in syncViewCountsToDatabase: " + e.getMessage());
        }
    }
    
    @Scheduled(fixedDelay = 60000) // Every 1 minute
    public void syncLikeCountsToDatabase() {
        try {
            Set<Object> dirtyArticleIds = redisTemplate.opsForSet().members(DIRTY_LIKE_ARTICLES_KEY);
            if (CollectionUtils.isEmpty(dirtyArticleIds)) {
                return;
            }
            
            for (Object idObj : dirtyArticleIds) {
                try {
                    Long articleId = Long.valueOf(idObj.toString());
                    String key = ARTICLE_LIKE_KEY_PREFIX + articleId;
                    Object countObj = redisTemplate.opsForValue().get(key);
                    
                    if (countObj != null) {
                        Long count = Long.valueOf(countObj.toString());
                        Article article = getById(articleId);
                        if (article != null) {
                            article.setLikeCount(article.getLikeCount() + count);
                            updateById(article);
                            redisTemplate.delete(key);
                            redisTemplate.opsForSet().remove(DIRTY_LIKE_ARTICLES_KEY, idObj);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Redis error in syncLikeCountsToDatabase: " + e.getMessage());
        }
    }
    
    @Scheduled(fixedDelay = 60000)
    public void processScheduledArticles() {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", Article.Status.SCHEDULED.getValue())
                   .le("scheduled_publish_time", LocalDateTime.now())
                   .eq("schedule_enabled", true);
        
        List<Article> scheduledArticles = list(queryWrapper);
        for (Article article : scheduledArticles) {
            article.setStatus(Article.Status.PUBLISHED.getValue());
            article.setPublishTime(LocalDateTime.now());
            article.setScheduleEnabled(false);
            updateById(article);
        }
    }
}
