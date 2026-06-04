package com.cafe.infrastructure.persistence;
import com.cafe.domain.model.Category;
import com.cafe.domain.model.MenuItem;
import com.cafe.domain.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
@RequiredArgsConstructor
public class MenuItemRepositoryAdapter implements MenuItemRepository {
    private final SpringDataMenuItemRepository jpaRepository;
    @Override
    public List<MenuItem> findAll() {
        return jpaRepository.findAll();
    }
    @Override
    public Optional<MenuItem> findById(Long id) {
        return jpaRepository.findById(id);
    }
    @Override
    public List<MenuItem> findByCategory(Category category) {
        return jpaRepository.findByCategory(category);
    }
    @Override
    public List<MenuItem> findByAvailableTrue() {
        return jpaRepository.findByAvailableTrue();
    }
    @Override
    public MenuItem save(MenuItem menuItem) {
        return jpaRepository.save(menuItem);
    }
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
}
