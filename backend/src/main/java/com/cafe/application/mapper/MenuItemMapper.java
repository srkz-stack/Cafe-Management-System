package com.cafe.application.mapper;
import com.cafe.application.dto.MenuItemDTO;
import com.cafe.application.dto.CreateMenuItemRequest;
import com.cafe.domain.model.MenuItem;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class MenuItemMapper {
    public MenuItemDTO toDTO(MenuItem entity) {
        return MenuItemDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .category(entity.getCategory())
                .available(entity.getAvailable())
                .build();
    }
    public List<MenuItemDTO> toDTOList(List<MenuItem> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    public MenuItem toEntity(CreateMenuItemRequest request) {
        return MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .available(request.getAvailable())
                .build();
    }
    public void updateEntity(MenuItem entity, CreateMenuItemRequest request) {
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPrice(request.getPrice());
        entity.setCategory(request.getCategory());
        entity.setAvailable(request.getAvailable());
    }
}
