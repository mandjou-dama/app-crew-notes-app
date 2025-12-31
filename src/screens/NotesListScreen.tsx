import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import { LogOut, Minus, Search, Trash2Icon } from "lucide-react-native";
import { EnrichedTextInput } from "react-native-enriched";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useDeleteAllNotes,
  useDeleteNote,
  useNotes,
  searchNotes,
} from "@/api/notes.queries";
import { COLORS, SPACES } from "@/constant";
import { authService } from "@/services/auth.service";
import { Note } from "@/types/note";
import { AppStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<AppStackParamList, "NotesList">;

export function NotesListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { data: notes, isLoading, isError, error, refetch } = useNotes();
  const deleteNoteMutation = useDeleteNote();
  const deleteAllNotesMutation = useDeleteAllNotes();
  const { data: searchNotesData, isLoading: isSearchLoading } =
    searchNotes(searchQuery);

  const netInfo = useNetInfo();

  useFocusEffect(
    useCallback(() => {
      refetch();
      console.log("refetch");
    }, [refetch])
  );

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authService.signOut();
        },
      },
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNoteMutation.mutate(id),
      },
    ]);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Notes",
      "Are you sure you want to delete all notes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => deleteAllNotesMutation.mutate(),
        },
      ]
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setIsSearchActive(text.length > 0);
  };

  const isLoadingNotes = isLoading || isSearchLoading;
  const errorMessage = isError ? (error as Error).message : null;
  const displayedNotes = isSearchActive ? searchNotesData || [] : notes || [];

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("NoteEditor", {
          noteId: item.id,
          title: item.title,
        })
      }
    >
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Pressable
            disabled={!netInfo.isConnected}
            style={{
              width: 35,
              height: 35,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.background,
              borderRadius: 8,
              borderCurve: "continuous",
              opacity: !netInfo.isConnected ? 0.5 : 1,
            }}
            onPress={() => handleDelete(item.id)}
          >
            <Trash2Icon size={18} color={COLORS.black} />
          </Pressable>
        </View>

        <View
          style={{
            maxHeight: 150,
            overflow: "hidden",
            marginBottom: SPACES.s,
            marginTop: SPACES.xs,
          }}
        >
          <EnrichedTextInput
            style={{ fontSize: 14 }}
            defaultValue={item?.content.trim() || ""}
            editable={false}
            androidExperimentalSynchronousEvents={false}
          />
        </View>

        <View style={{ marginBottom: SPACES.s, flexDirection: "row" }}>
          <Minus strokeWidth={1} />
        </View>

        <Text style={styles.cardDate}>
          {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>

        <View style={{ flexDirection: "row", gap: SPACES.m }}>
          <Pressable
            disabled={notes?.length === 0 || !netInfo.isConnected}
            style={{
              backgroundColor: COLORS.white,
              width: 46,
              height: 46,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              borderCurve: "continuous",
              opacity: notes?.length === 0 || !netInfo.isConnected ? 0.5 : 1,
            }}
            onPress={handleDeleteAll}
          >
            <Trash2Icon size={24} color={COLORS.black} />
          </Pressable>
          <Pressable
            disabled={!netInfo.isConnected}
            style={{
              backgroundColor: COLORS.white,
              width: 46,
              height: 46,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              borderCurve: "continuous",
              opacity: !netInfo.isConnected ? 0.5 : 1,
            }}
            onPress={handleLogout}
          >
            <LogOut size={24} color={COLORS.black} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={24} color={COLORS.black} />
        <TextInput
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search notes..."
          style={styles.searchInput}
        />
      </View>

      {isLoadingNotes && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.black} />
        </View>
      )}

      {!isLoadingNotes && displayedNotes?.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No notes found. Create a new note!
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load notes.</Text>
          <Text style={styles.errorSubtext}>
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoadingNotes && displayedNotes?.length! > 0 && !error && (
        <FlashList
          data={displayedNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          masonry
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { opacity: netInfo.isConnected ? 1 : 0.5 }]}
        disabled={!netInfo.isConnected}
        onPress={() => {
          if (netInfo.isConnected) {
            navigation.navigate("NoteEditor", { title: "New Note" });
          }
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    paddingHorizontal: SPACES.m,
    paddingVertical: 8,
    borderRadius: 13,
    marginBottom: 8,
    borderCurve: "continuous",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.white,
    // marginBottom: 16,
    margin: 6,
    borderRadius: 13,
    paddingVertical: SPACES.l,
    paddingLeft: SPACES.l - 5,
    paddingRight: SPACES.l,
    borderCurve: "continuous",
    // marginRight: SPACES.m,
  },
  cardContent: {
    flex: 1,
    // marginRight: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
    paddingTop: 0,
    marginTop: 0,
    width: "75%",
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.black,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
    marginTop: -4,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 8,
  },
  errorSubtext: {
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});
