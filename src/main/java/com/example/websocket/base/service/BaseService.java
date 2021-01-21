package com.example.websocket.base.service;




import com.example.websocket.base.repository.BaseRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface BaseService<E, Repository extends BaseRepository<E>> {

    E save(E e);

    Optional<E> findById(Long id);

    void deleteById(Long id);

    Set<E> findAll();

    Set<E> findByIdsIn(Collection<Long> ids);
}
