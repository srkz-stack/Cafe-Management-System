package com.cafe.domain.repository;
import com.cafe.domain.model.Category;
import com.cafe.domain.model.MenuItem;
import java.util.List;
import java.util.Optional;
public interface MenuItemRepository {
    List<MenuItem> findAll();
    Optional<MenuItem> findById(Long id);
    List<MenuItem> findByCategory(Category category);
    List<MenuItem> findByAvailableTrue();
    MenuItem save(MenuItem menuItem);
    void deleteById(Long id);
    boolean existsById(Long id);
}
