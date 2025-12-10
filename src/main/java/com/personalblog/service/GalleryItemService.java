package com.personalblog.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.personalblog.domain.GalleryItem;
import com.personalblog.mapper.GalleryItemMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GalleryItemService extends ServiceImpl<GalleryItemMapper, GalleryItem> {
    
    public List<GalleryItem> getGalleryItems() {
        return list(); // For now, return all. Pagination can be added later.
    }
}
