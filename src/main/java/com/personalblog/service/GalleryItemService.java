package com.personalblog.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.personalblog.domain.GalleryItem;
import com.personalblog.mapper.GalleryItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GalleryItemService extends ServiceImpl<GalleryItemMapper, GalleryItem> {
    
    @Autowired
    private FileStorageService fileStorageService;

    public List<GalleryItem> getGalleryItems() {
        return list(); // For now, return all. Pagination can be added later.
    }
    
    public boolean deleteGalleryItem(Long id) {
        GalleryItem item = getById(id);
        if (item != null) {
            // URL format is likely "/uploads/filename.ext" or "http://.../uploads/filename.ext"
            // We need to extract the filename.
            String url = item.getUrl();
            if (url != null && url.contains("/uploads/")) {
                String fileName = url.substring(url.lastIndexOf("/") + 1);
                fileStorageService.deleteFile(fileName);
            }
            return removeById(id);
        }
        return false;
    }
}
