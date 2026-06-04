package com.cafe.application.service;
import com.cafe.application.dto.CreateMenuItemRequest;
import com.cafe.application.dto.MenuItemDTO;
import com.cafe.application.mapper.MenuItemMapper;
import com.cafe.domain.model.Category;
import com.cafe.domain.model.MenuItem;
import com.cafe.domain.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    private final MenuItemRepository menuItemRepository;
    private final MenuItemMapper menuItemMapper;
    @Cacheable(value = "menuItems", key = "'all'")
    public List<MenuItemDTO> getAllMenuItems() {
        log.debug("Cache MISS — fetching all menu items from database");
        return menuItemMapper.toDTOList(menuItemRepository.findAll());
    }
    @Cacheable(value = "menuItems", key = "#id")
    public MenuItemDTO getMenuItemById(Long id) {
        log.debug("Cache MISS — fetching menu item {} from database", id);
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));
        return menuItemMapper.toDTO(item);
    }
    public List<MenuItemDTO> getMenuItemsByCategory(Category category) {
        return menuItemMapper.toDTOList(menuItemRepository.findByCategory(category));
    }
    @CacheEvict(value = "menuItems", allEntries = true)
    public MenuItemDTO createMenuItem(CreateMenuItemRequest request) {
        log.info("Creating menu item: {} — cache evicted", request.getName());
        MenuItem entity = menuItemMapper.toEntity(request);
        MenuItem saved = menuItemRepository.save(entity);
        return menuItemMapper.toDTO(saved);
    }
    @CacheEvict(value = "menuItems", allEntries = true)
    public MenuItemDTO updateMenuItem(Long id, CreateMenuItemRequest request) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));
        menuItemMapper.updateEntity(existing, request);
        MenuItem saved = menuItemRepository.save(existing);
        log.info("Updated menu item {} — cache evicted", id);
        return menuItemMapper.toDTO(saved);
    }
    @CacheEvict(value = "menuItems", allEntries = true)
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
        log.info("Deleted menu item {} — cache evicted", id);
    }
}
